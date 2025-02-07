import { get, writable } from "svelte/store";
import { ChatMessage as NewChatMessage, ChatRoom } from "../Connection/ChatConnection";
import { chatVisibilityStore } from "../../Stores/ChatStore";
import { matrixSecurity } from "../Connection/Matrix/MatrixSecurity";
import { gameManager } from "../../Phaser/Game/GameManager";

function createNavChatStore() {
    const { subscribe, set } = writable<"chat" | "users">("chat");

    return {
        subscribe,
        switchToChat() {
            set("chat");
        },
        switchToUserList() {
            const room = gameManager.getCurrentGameScene().room;
            const isChatOnlineListEnabled = room.isChatOnlineListEnabled;
            const isChatDisconnectedListEnabled = room.isChatDisconnectedListEnabled;

            if (isChatOnlineListEnabled || isChatDisconnectedListEnabled) {
                set("users");
            }
        },
    };
}

export const navChat = createNavChatStore();
//export const navChat = writable<"chat" | "users">("chat");

export const shownRoomListStore = writable<string>("");
export const chatSearchBarValue = writable<string>("");

const createSelectedRoomStore = () => {
    const { subscribe, update } = writable<ChatRoom | undefined>(undefined);

    const customSet = (value: ChatRoom | undefined) => {
        update((currentValue) => {
            if (
                currentValue !== value &&
                value &&
                get(value.isEncrypted) &&
                !get(alreadyAskForInitCryptoConfiguration)
            ) {
                matrixSecurity.openChooseDeviceVerificationMethodModal().catch((error) => {
                    console.error(error);
                });
            }

            return value;
        });
    };

    return {
        subscribe,
        set: customSet,
    };
};

export const selectedRoomStore = createSelectedRoomStore();

export const selectedChatMessageToReply = writable<NewChatMessage | null>(null);

export const selectedChatMessageToEdit = writable<NewChatMessage | null>(null);

export const joignableRoom = writable<{ id: string; name: string | undefined }[]>([]);

export const isAChatRoomIsVisible = () => {
    return get(selectedRoomStore) && get(navChat) === "chat" && get(chatVisibilityStore);
};

export const alreadyAskForInitCryptoConfiguration = writable(false);

export const isChatIdSentToPusher = writable(false);
