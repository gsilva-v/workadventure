import * as Sentry from "@sentry/svelte";
import { MapStore, SearchableArrayStore } from "@workadventure/store-utils";
import { Readable, Writable, get, writable, Unsubscriber } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { Subscription } from "rxjs";
import { AvailabilityStatus } from "@workadventure/messages";
import { ChatMessageTypes } from "@workadventure/shared-utils";
import {
    ChatMessage,
    ChatMessageContent,
    ChatMessageReaction,
    ChatMessageType,
    ChatRoom,
    ChatUser,
} from "../ChatConnection";
import LL from "../../../../i18n/i18n-svelte";
import { iframeListener } from "../../../Api/IframeListener";
import { SpaceInterface } from "../../../Space/SpaceInterface";
import { SpaceRegistryInterface } from "../../../Space/SpaceRegistry/SpaceRegistryInterface";
import { chatVisibilityStore } from "../../../Stores/ChatStore";
import { isAChatRoomIsVisible, navChat, selectedRoomStore } from "../../Stores/ChatStore";
import { SpaceFilterInterface, SpaceUserExtended } from "../../../Space/SpaceFilter/SpaceFilter";
import { mapExtendedSpaceUserToChatUser } from "../../UserProvider/ChatUserMapper";
import { SimplePeer } from "../../../WebRtc/SimplePeer";
import { bindMuteEventsToSpace } from "../../../Space/Utils/BindMuteEvents";
import { gameManager } from "../../../Phaser/Game/GameManager";
import { availabilityStatusStore, requestedCameraState, requestedMicrophoneState } from "../../../Stores/MediaStore";
import { localUserStore } from "../../../Connection/LocalUserStore";
import { MessageNotification, notificationManager } from "../../../Notification";

export class ProximityChatMessage implements ChatMessage {
    isQuotedMessage = undefined;
    quotedMessage = undefined;
    isDeleted = writable(false);
    isModified = writable(false);
    canDelete = writable(false);

    constructor(
        public id: string,
        public sender: ChatUser,
        public content: Readable<ChatMessageContent>,
        public date: Date,
        public isMyMessage: boolean,
        public type: ChatMessageType
    ) {}

    remove(): void {
        console.info("Function not implemented.");
    }
    edit(newContent: string): Promise<void> {
        console.info("Function not implemented.", newContent);
        return Promise.resolve();
    }
    addReaction(reaction: string): Promise<void> {
        console.info("Function not implemented.", reaction);
        return Promise.resolve();
    }
}

export class ProximityChatRoom implements ChatRoom {
    id = "proximity";
    name = writable("Proximity Chat");
    type: "direct" | "multiple" = "direct";
    hasUnreadMessages = writable(false);
    avatarUrl = undefined;
    messages: SearchableArrayStore<string, ChatMessage> = new SearchableArrayStore((item) => item.id);
    messageReactions: MapStore<string, MapStore<string, ChatMessageReaction>> = new MapStore();
    hasPreviousMessage = writable(false);
    isEncrypted = writable(false);
    typingMembers: Writable<Array<{ id: string; name: string | null; avatarUrl: string | null }>>;
    private _space: SpaceInterface | undefined;
    private _spaceWatcher: SpaceFilterInterface | undefined;
    private spaceMessageSubscription: Subscription | undefined;
    private spaceIsTypingSubscription: Subscription | undefined;
    private users: Map<number, SpaceUserExtended> | undefined;
    private usersUnsubscriber: Unsubscriber | undefined;
    private spaceWatcherUserJoinedObserver: Subscription | undefined;
    private spaceWatcherUserLeftObserver: Subscription | undefined;
    private newChatMessageWritingStatusStreamUnsubscriber: Subscription;
    areNotificationsMuted = writable(false);
    isRoomFolder = false;
    lastMessageTimestamp = 0;
    hasUserInProximityChat = writable(false);

    private unknownUser = {
        chatId: "0",
        uuid: "0",
        availabilityStatus: writable(AvailabilityStatus.ONLINE),
        username: "Unknown",
        avatarUrl: undefined,
        roomName: undefined,
        playUri: undefined,
        color: undefined,
        id: undefined,
    } as ChatUser;

    constructor(
        private _userId: number,
        private spaceRegistry: SpaceRegistryInterface,
        private simplePeer: SimplePeer,
        iframeListenerInstance: Pick<typeof iframeListener, "newChatMessageWritingStatusStream">,
        private notifyNewMessage = (message: ProximityChatMessage) => {
            if (!localUserStore.getChatSounds() || get(this.areNotificationsMuted)) return;
            gameManager.getCurrentGameScene().playSound("new-message");
            notificationManager.createNotification(
                new MessageNotification(
                    message.sender.username ?? "unknown",
                    get(message.content).body,
                    this.id,
                    get(this.name)
                )
            );
        }
    ) {
        this.typingMembers = writable([]);

        this.newChatMessageWritingStatusStreamUnsubscriber =
            iframeListenerInstance.newChatMessageWritingStatusStream.subscribe((status) => {
                if (status === ChatMessageTypes.userWriting) {
                    this.startTyping().catch((e) => {
                        console.error("Error while sending typing status", e);
                    });
                } else if (status === ChatMessageTypes.userStopWriting) {
                    this.stopTyping().catch((e) => {
                        console.error("Error while sending typing status", e);
                    });
                }
            });
    }

    sendMessage(message: string, action: ChatMessageType = "proximity", broadcast = true): void {
        // Create content message
        const newChatMessageContent = {
            body: message,
            url: undefined,
        };

        const spaceUser = this.users?.get(this._userId);
        let chatUser: ChatUser = this.unknownUser;
        if (spaceUser) {
            chatUser = mapExtendedSpaceUserToChatUser(spaceUser);
        }

        // Create message
        const newMessage = new ProximityChatMessage(
            uuidv4(),
            chatUser,
            writable(newChatMessageContent),
            new Date(),
            true,
            action
        );

        // Add message to the list
        this.messages.push(newMessage);

        this.lastMessageTimestamp = newMessage.date.getTime();

        // Use the room connection to send the message to other users of the space
        if (broadcast) {
            this._space?.emitPublicMessage({
                $case: "spaceMessage",
                spaceMessage: {
                    message: message,
                },
            });
        }

        if (action === "proximity") {
            // Send local message to WorkAdventure scripting API
            try {
                iframeListener.sendUserInputChat(message, undefined);
            } catch (e) {
                console.error("Error while sending message to WorkAdventure scripting API", e);
            }
        }
    }

    private addIncomingUser(spaceUser: SpaceUserExtended): void {
        this.sendMessage(get(LL).chat.timeLine.incoming({ userName: spaceUser.name }), "incoming", false);
        /*const newChatUser = mapExtendedSpaceUserToChatUser(spaceUser);

        //if (userUuid === this._userUuid) return;
        this._connection.connectedUsers.update((users) => {
            users.set(userId, newChatUser);
            return users;
        });
        this.membersId.push(userId.toString());*/
    }

    private addOutcomingUser(spaceUser: SpaceUserExtended): void {
        this.sendMessage(get(LL).chat.timeLine.outcoming({ userName: spaceUser.name }), "outcoming", false);
        this.removeTypingUserbyID(spaceUser.id.toString());

        /*this._connection.connectedUsers.update((users) => {
            users.delete(userId);
            return users;
        });
        this.membersId = this.membersId.filter((id) => id !== userId.toString());*/
    }

    /**
     * Add a message from a remote user to the proximity chat.
     */
    private addNewMessage(message: string, senderUserId: number): void {
        // Ignore messages from the current user
        if (senderUserId === this._userId) {
            return;
        }

        // Create content message
        const newChatMessageContent = {
            body: message,
            url: undefined,
        };

        const spaceUser = this.users?.get(senderUserId);
        let chatUser: ChatUser = this.unknownUser;
        if (spaceUser) {
            chatUser = mapExtendedSpaceUserToChatUser(spaceUser);
        }

        // Create message
        const newMessage = new ProximityChatMessage(
            uuidv4(),
            chatUser,
            writable(newChatMessageContent),
            new Date(),
            false,
            "proximity"
        );

        // Add message to the list
        this.messages.push(newMessage);

        this.lastMessageTimestamp = newMessage.date.getTime();

        this.notifyNewMessage(newMessage);

        if (get(selectedRoomStore) !== this) {
            this.hasUnreadMessages.set(true);
        }
        // Send bubble message to WorkAdventure scripting API
        try {
            iframeListener.sendUserInputChat(message, senderUserId);
        } catch (e) {
            console.error("Error while sending message to WorkAdventure scripting API", e);
        }
    }

    sendFiles(files: FileList): Promise<void> {
        return Promise.resolve();
    }
    setTimelineAsRead(): void {
        console.info("setTimelineAsRead => Method not implemented yet!");
    }

    loadMorePreviousMessages(): Promise<void> {
        return Promise.resolve();
    }

    addExternalMessage(type: "local" | "bubble", message: string, authorName?: string): void {
        // Create content message
        const newChatMessageContent = {
            body: message,
            url: undefined,
        };

        // Create message
        const newMessage = new ProximityChatMessage(
            uuidv4(),
            {
                ...this.unknownUser,
                username: authorName ?? this.unknownUser.username,
            },
            writable(newChatMessageContent),
            new Date(),
            false,
            "proximity"
        );

        // Add message to the list
        this.messages.push(newMessage);

        // If type is bubble, we need to forward the message to the other users
        if (type === "bubble") {
            this._space?.emitPublicMessage({
                $case: "spaceMessage",
                spaceMessage: {
                    message: message,
                },
            });
        }
    }

    startTyping(): Promise<object> {
        this._space?.emitPublicMessage({
            $case: "spaceIsTyping",
            spaceIsTyping: {
                isTyping: true,
            },
        });
        return Promise.resolve({});
    }
    stopTyping(): Promise<object> {
        this._space?.emitPublicMessage({
            $case: "spaceIsTyping",
            spaceIsTyping: {
                isTyping: false,
            },
        });

        return Promise.resolve({});
    }

    private addTypingUser(senderUserId: number): void {
        const sender = this.users?.get(senderUserId);
        if (sender === undefined) {
            return;
        }
        const id = sender.id.toString();
        this.typingMembers.update((typingMembers) => {
            if (typingMembers.find((user) => user.id === id) == undefined) {
                typingMembers.push({
                    id,
                    name: sender.name ?? null,
                    avatarUrl: sender.getWokaBase64 ?? null,
                });
            }
            return typingMembers;
        });
    }

    private removeTypingUser(senderUserId: number): void {
        const sender = this.users?.get(senderUserId);
        if (sender === undefined) {
            return;
        }

        const id = sender.id.toString();

        this.typingMembers.update((typingMembers) => {
            return typingMembers.filter((user) => user.id !== id);
        });
    }

    private removeTypingUserbyID(id: string) {
        this.typingMembers.update((typingMembers) => {
            return typingMembers.filter((user) => user.id !== id);
        });
    }

    addExternalTypingUser(id: string, name: string, avatarUrl: string | null): void {
        this.typingMembers.update((typingMembers) => {
            if (typingMembers.find((user) => user.id === id) == undefined) {
                typingMembers.push({ id, name, avatarUrl });
            }
            return typingMembers;
        });
    }

    removeExternalTypingUser(id: string) {
        this.typingMembers.update((typingMembers) => {
            return typingMembers.filter((user) => user.id !== id);
        });
    }

    public joinSpace(spaceName: string): void {
        this._space = this.spaceRegistry.joinSpace(spaceName);
        bindMuteEventsToSpace(this._space);

        this._spaceWatcher = this._space.watchAllUsers();
        this.usersUnsubscriber = this._spaceWatcher.usersStore.subscribe((users) => {
            this.users = users;
            this.hasUserInProximityChat.set(users.size > 1);
        });

        this.spaceWatcherUserJoinedObserver = this._spaceWatcher.observeUserJoined.subscribe((spaceUser) => {
            if (spaceUser.id === this._userId) {
                return;
            }
            this.addIncomingUser(spaceUser);
        });

        this.spaceWatcherUserLeftObserver = this._spaceWatcher.observeUserLeft.subscribe((spaceUser) => {
            this.addOutcomingUser(spaceUser);
        });

        this.spaceMessageSubscription?.unsubscribe();
        this.spaceMessageSubscription = this._space.observePublicEvent("spaceMessage").subscribe((event) => {
            this.addNewMessage(event.spaceMessage.message, event.sender);

            // if the proximity chat is not open, open it to see the message
            chatVisibilityStore.set(true);
            if (get(selectedRoomStore) == undefined) selectedRoomStore.set(this);
        });

        this.spaceIsTypingSubscription?.unsubscribe();
        this.spaceIsTypingSubscription = this._space.observePublicEvent("spaceIsTyping").subscribe((event) => {
            if (event.spaceIsTyping.isTyping) {
                this.addTypingUser(event.sender);
            } else {
                this.removeTypingUser(event.sender);
            }
        });

        this.simplePeer.setSpaceFilter(this._spaceWatcher);

        const actualStatus = get(availabilityStatusStore);
        if (!isAChatRoomIsVisible()) {
            selectedRoomStore.set(this);
            navChat.switchToChat();
            if (
                !get(requestedMicrophoneState) &&
                !get(requestedCameraState) &&
                (actualStatus === AvailabilityStatus.ONLINE || actualStatus === AvailabilityStatus.AWAY)
            ) {
                chatVisibilityStore.set(true);
            }
        }
    }

    public leaveSpace(spaceName: string): void {
        if (!this._space) {
            console.error("Trying to leave a space that is not joined");
            Sentry.captureMessage("Trying to leave a space that is not joined");
            return;
        }
        if (this._space.getName() !== spaceName) {
            console.error("Trying to leave a space different from the one joined");
            Sentry.captureMessage("Trying to leave a space different from the one joined");
            return;
        }

        if (this.users) {
            if (this.users.size > 2) {
                this.sendMessage(get(LL).chat.timeLine.youLeft(), "outcoming", false);
            } else {
                for (const user of this.users.values()) {
                    if (user.id === this._userId) {
                        continue;
                    }
                    this.sendMessage(get(LL).chat.timeLine.outcoming({ userName: user.name }), "outcoming", false);
                }
            }
            this.typingMembers.set([]);
        }
        this.hasUserInProximityChat.set(false);

        this.spaceWatcherUserJoinedObserver?.unsubscribe();
        this.spaceWatcherUserLeftObserver?.unsubscribe();
        if (this.usersUnsubscriber) {
            this.usersUnsubscriber();
        }
        this.users = undefined;
        this.spaceRegistry.leaveSpace(this._space);
        this.spaceMessageSubscription?.unsubscribe();
        this.spaceIsTypingSubscription?.unsubscribe();

        this.simplePeer.setSpaceFilter(undefined);
    }

    public destroy(): void {
        this.newChatMessageWritingStatusStreamUnsubscriber.unsubscribe();
    }
}
