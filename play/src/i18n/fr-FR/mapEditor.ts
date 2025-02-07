import type { DeepPartial } from "../DeepPartial";
import type { Translation } from "../i18n-types";

const mapEditor: DeepPartial<Translation["mapEditor"]> = {
    map: {
        refreshPrompt: "Nouvelle version de la carte détectée. Actualisation nécessaire",
    },
    sideBar: {
        areaEditor: "Outil d'édition de zone",
        entityEditor: "Outil d'édition d'entités",
        tileEditor: "Outil d'édition de tuiles",
        configureMyRoom: "Configurer le salon",
        trashEditor: "Corbeille",
        exploreTheRoom: "Explorer le salon",
        closeMapEditor: "Fermer l'éditeur de carte",
        mapManagerActivated: "Gestionnaire de carte activé",
        mapExplorerActivated: "Survol de la carte",
        exploreTheRoomActivated: "Exploration de la carte activée",
        areaEditorActivated: "Édition de zone activée",
        entityEditorActivated: "Édition d'objets activée",
        trashEditorActivated: "Corbeille activée",
        configureMyRoomActivated: "Configuration de la salle activée",
    },
    properties: {
        silentProperty: {
            label: "Silent",
            description: "Ne permet pas les conversations à l'intérieur.",
        },
        textProperties: {
            label: "Texte d'en-tête",
            placeholder: "Saisissez ici le texte qui sera affiché lors de l'interaction avec l'objet",
        },
        focusableProperties: {
            label: "Focalisable",
            description: "Focaliser sur cette zone à l'entrée.",
            zoomMarginLabel: "Marge de Zoom",
            defaultButtonLabel: "Focaliser sur",
        },
        jitsiProperties: {
            label: "Salle Jitsi",
            description: "Démarrer une réunion Jitsi à l'entrée.",
            jitsiUrl: "URL Jitsi",
            jitsiUrlPlaceholder: "meet.jit.si",
            roomNameLabel: "Nom de Salle",
            roomNamePlaceholder: "Nom de la Salle",
            defaultButtonLabel: "Ouvrir la salle Jitsi",
            audioMutedLabel: "Désactivé par défaut",
            moreOptionsLabel: "Plus d'options",
            trigger: "Interaction d'ouverture",
            triggerMessage: "Message d'information",
            triggerShowImmediately: "Afficher immédiatement à l'entrée",
            triggerOnClick: "Démarrer en mode réduit dans la barre inférieure",
            triggerOnAction: "Afficher un message d'information avec le message",
            closable: "Peut être fermé",
            noPrefix: "Peut être ouvert dans d'autres salons",
            width: "Largeur",
            jitsiRoomConfig: {
                addConfig: "Ajouter une option",
                startWithAudioMuted: "Démarrer avec le microphone désactivé",
                startWithVideoMuted: "Démarrer avec la vidéo désactivée",
                jitsiRoomAdminTag: "Tag modérateur du meeting",
                cancel: "Annuler",
                validate: "Valider",
            },
            disabled: "L'intégration Jitsi est désactivée sur ce salon ❌",
        },
        audioProperties: {
            label: "Jouer un fichier audio",
            description: "Jouer un audio avec un volume réglable.",
            audioLinkLabel: "Lien vers l'audio",
            audioLinkPlaceholder: "https://xxx.yyy/smthing.mp3",
            defaultButtonLabel: "Jouer de la musique",
            volumeLabel: "Volume",
            error: "Impossible de charger le son",
        },
        linkProperties: {
            label: "Ouvrir un lien",
            description: "Ouvrir un site web dans l'application ou dans un nouvel onglet.",
            linkLabel: "URL du Lien",
            trigger: "Interaction",
            triggerMessage: "Message d'information",
            triggerShowImmediately: "Afficher immédiatement à l'entrée",
            triggerOnClick: "Démarrer en mode réduit dans la barre inférieure",
            triggerOnAction: "Afficher un message d'information avec le message",
            closable: "Peut être fermé",
            allowAPI: "Autoriser la Scripting API",
            newTabLabel: "Ouvrir dans un nouvel onglet",
            linkPlaceholder: "https://example.com",
            defaultButtonLabel: "Ouvrir le lien",
            width: "Largeur",
            policy: "iFrame Autorisé",
            policyPlaceholder: "fullscreen",
            errorEmbeddableLink: "Le lien ne peut pas être intégré",
            messageNotEmbeddableLink:
                "Le lien ne peut pas être intégré. Il peut uniquement s'ouvrir dans un nouvel onglet.",
            warningEmbeddableLink: "Ce lien ne peut pas être intégré.",
            errorInvalidUrl: 'Veuillez entrer une URL valide (commençant par "https://")',
            findOutMoreHere: "En savoir plus ici",
            openPickerSelector: "Ouvrir le sélecteur",
            forcedInNewTab: "Ouverture forcée dans un nouvel onglet",
            openApplication: "Ouvrir l'application",
        },
        advancedOptions: "Options avancées",
        speakerMegaphoneProperties: {
            label: "Zone conférencier",
            description: "",
            nameLabel: "Nom de la zone de diffusion",
            namePlaceholder: "MaZoneDeDiffusion",
            disabled: "La zone de diffusion est désactivée sur ce salon ❌",
        },
        listenerMegaphoneProperties: {
            label: "Zone participant",
            description: "",
            nameLabel: "Nom de la zone de diffusion",
            namePlaceholder: "MaZoneDeDiffusion",
            disabled: "La zone participant est désactivée sur ce salon ❌",
        },
        chatEnabled: "Chat activé",
        startProperties: {
            label: "Zone de départ",
            description: "Où les joueurs apparaissent lorsqu'ils entrent dans la carte.",
            nameLabel: "Nom de la zone de départ",
            namePlaceholder: "MaZoneDeDépart",
        },
        exitProperties: {
            label: "Zone de sortie",
            description: "Où les joueurs apparaissent lorsqu'ils quittent la carte.",
            exitMap: "Quitter la carte",
            exitMapStartAreaName: "Nom de la zone de départ",
            defaultStartArea: "Zone de départ par défaut",
        },
        youtubeProperties: {
            label: "Ouvrir YouTube",
            description: "Ouvrir YouTube dans l'application ou dans un nouvel onglet.",
            error: "Veuillez entrer une URL YouTube valide",
            disabled: "L'intégration YouTube est désactivée.",
        },
        googleDocsProperties: {
            label: "Ouvrir Google Docs",
            description: "Ouvrir Google Docs dans l'application ou dans un nouvel onglet.",
            error: "Veuillez entrer une URL Google Docs valide",
            disabled: "L'intégration Google Docs est désactivée.",
        },
        klaxoonProperties: {
            label: "Ouvrir Klaxoon",
            description: "Ouvrir Klaxoon dans l'application ou dans un nouvel onglet.",
            error: "Veuillez entrer une URL Klaxoon valide",
            disabled: "L'intégration Klaxoon est désactivée.",
        },
        googleSheetsProperties: {
            label: "Ouvrir Google Sheets",
            description: "Ouvrir Google Sheets dans l'application ou dans un nouvel onglet.",
            error: "Veuillez entrer une URL Google Sheets valide",
            disabled: "L'intégration Google Sheets est désactivée.",
        },
        googleSlidesProperties: {
            label: "Ouvrir Google Slides",
            description: "Ouvrir Google Slides dans l'application ou dans un nouvel onglet.",
            error: "Veuillez entrer une URL Google Slides valide",
            disabled: "L'intégration Google Slides est désactivée.",
        },
        eraserProperties: {
            label: "Ouvrir Eraser",
            description: "Ouvrir Eraser dans l'application ou dans un nouvel onglet.",
            error: "Veuillez entrer une URL Eraser valide",
            disabled: "L'intégration Eraser est désactivée.",
        },
        googleDriveProperties: {
            label: "Ouvrir Google Drive",
            description: "Ouvrir un lien Google Drive dans l'application ou dans un nouvel onglet.",
            error: "Veuillez entrer une URL Google Drive valide",
            disabled: "L'intégration Google Drive est désactivée.",
        },
        restrictedRightsProperties: {
            label: "Ajouter des droits",
            rightTitle: "Droit d'accès et d'édition via les tags utilisateur",
            rightWriteTitle: "Droits d'édition",
            rightWriteDescription:
                "Les droits d'édition définissent qui peut modifier la zone. Les utilisateurs correspondant à l'un de ces tags peuvent créer, mettre à jour ou supprimer un objet dans la zone.",
            rightReadTitle: "Droits d'accès",
            rightReadDescription:
                "Les droits d'accès définissent qui peut interagir avec la zone. Les utilisateurs correspondant à l'un de ces tags peuvent entrer dans la zone et utiliser les objets qui s'y trouvent.",
        },
        personalAreaConfiguration: {
            label: "Zone personnelle",
            description:
                "La définition d'une zone personnelle permet à l'utilisateur de revendiquer cette zone comme son propre espace. En tant qu'administrateur, vous pouvez définir/révoquer un espace à un utilisateur.",
            accessClaimMode: "Mode d'attribution de l'accès",
            dynamicAccessClaimMode: "Dynamique",
            staticAccessClaimMode: "Statique",
            dynamicAccessDescription:
                "Définir les tags d'utilisateur autorisées à revendiquer la propriété de la zone.",
            staticAccessDescription: "Définir l'utilisateur qui est le propriétaire de la zone.",
            allowedTags: "Tags utilisateur autorisés",
            allowedUser: "Utilisateur autorisé",
            owner: "Propriétaire",
            revokeAccess: "Révoquer l'accès",
        },
        excalidrawProperties: {
            label: "Ouvrir Excalidraw",
            description:
                "Un outil de dessin à la main virtuel (preque comme un tableau blanc). Collaboratif et chiffré de bout en bout.",
            error: "Veuillez entrer une URL Excalidraw valide",
            disabled: "L'intégration Excalidraw est désactivée.",
        },
        cardsProperties: {
            label: "Ouvrir Cards",
            description:
                "Simplifiez l'accès aux savoirs de vos équipes, clients et partenaires ! Format digeste, accessible sur tous supports.",
            error: "Veuillez entrer une URL Cards valide",
            disabled: "L'intégration Cards est désactivée.",
        },
        matrixProperties: {
            label: "Lier un salon Matrix",
            description: "Lier un salon Matrix",
            openAutomaticallyChatLabel: "Ouvrir le chat automatiquement",
            roomNameLabel: "Nom du salon",
            roomNameLabelPlaceholder: "Mon Salon",
            defaultChatRoomAreaName: "Salon de zone",
        },
    },
    areaEditor: {
        editInstructions: "Sélectionnez une zone pour modifier ses propriétés.",
        nameLabel: "Nom de la zone",
        nameLabelPlaceholder: "MaZone",
        areaDescription: "Description de la zone",
        areaDescriptionPlaceholder: "Description de la zone",
        areaSerchable: "Recherchable dans le mode exploration",
        addDescriptionField: "Ajouter une description",
        actionPopupOnPersonalAreaWithEntities: {
            title: "Action requise",
            description: "Cette zone personnelle contient un ou plusieurs objets. Que souhaitez-vous faire avec ?",
            buttons: {
                keep: "Conserver",
                remove: "Supprimer",
                cancel: "Annuler",
            },
        },
    },
    areaEditorInstructions: {
        title: "Comment ca marche ?",
        description: "Dessinez une zone sur la carte afin d'en créer une nouvelle.",
    },
    entityEditor: {
        header: {
            title: "Ajouter un objet",
            description: "Recherchez, téléchargez ou sélectionnez un objet existant et ajoutez-le à la carte.",
        },
        title: "Outil d'édition d'entités",
        editing: "Edition : {name}",
        itemPicker: {
            searchPlaceholder: "Rechercher",
            backToSelectObject: "Retour à la sélection d'objet",
        },
        trashTool: {
            delete: "Supprimer un item en cliquant dessus !",
        },
        deleteButton: "Supprimer",
        testInteractionButton: "Tester interaction",
        buttonLabel: "Texte du bouton",
        editInstructions: "Sélectionnez un objet pour modifier ses propriétés.",
        selectObject: "Cliquer sur un objet pour le selectionner",
        objectName: "Nom de l'objet",
        objectNamePlaceholder: "MonObjet",
        objectDescription: "Description de l'objet",
        objectDescriptionPlaceholder: "Description de l'objet",
        objectSearchable: "Recherchable dans le mode exploration",
        addDescriptionField: "Ajouter une description",
        uploadEntity: {
            title: "Ajouter votre image",
            description: "Glissez-déposer ou choisissez votre image afin de l'ajouter sur la carte",
            dragDrop: "Glissez-déposer ou",
            chooseFile: "Choisir ",
            errorOnFileFormat: "Format du fichier non supporté",
            errorOnFileNumber: "Dépot multiple de fichier non supporté",
        },
        images: "Image{{s}}",
        noImage: "Aucune image",
        customEntityEditorForm: {
            imageName: "Nom de l'image",
            tags: "Tags",
            writeTag: "Ecrire un tag...",
            objectType: "Type d'objet",
            floatingObject: "Objet flottant",
            floatingObjectDescription:
                "Un objet flottant peut être placé librement sur la carte. Autrement, il sera aligné sur la grille de la carte.",
            depth: "Profondeur",
            groundLevel: "Au sol",
            custom: "Personnalisé",
            standing: "Debout",
            collision: "Collision",
            wokaAbove: "Woka devant",
            wokaBelow: "Woka derrière",
        },
        buttons: {
            editEntity: "Editer",
            back: "Retour",
            cancel: "Annuler",
            delete: "Supprimer",
            save: "Enregister",
            upload: "Charger",
        },
    },
    settings: {
        loading: "Chargement en cours",
        megaphone: {
            title: "Megaphone",
            description:
                "Le megaphone est un outil qui permet de diffuser un flux vidéo/audio à tous les joueurs dans la salle/monde.",
            inputs: {
                spaceName: "Nom de l'espace",
                spaceNameHelper:
                    "Si vous souhaitez diffuser un flux à tous les utilisateurs qui se trouvent dans différentes salles mais dans le même monde, vous devez définir le même nom d'espace pour tous les paramètres du megaphone dans chaque salle et définir la portée sur 'Monde'.",
                scope: "Portée",
                world: "Monde",
                room: "Salle",
                rights: "Droits",
                rightsHelper:
                    "Les droits définissent qui peut utiliser le megaphone. Si vous le laissez vide, tout le monde peut l'utiliser. Si vous le définissez, seuls les utilisateurs qui ont au moins l'un de ces 'tags' peuvent l'utiliser.",
                error: {
                    title: "Veuillez entrer un nom",
                    save: {
                        success: "Paramètres enregstrés avec succès",
                        fail: "Une erreur est survenue lors de l'enregistrement des paramètres",
                    },
                },
            },
        },
    },
    explorer: {
        title: "Explorateur de carte",
        description:
            "Permet d'explorer la salle. Vous pourrez vous déplacer dans la salle et interagir avec les objets. Deux modes sont disponibles : 'Exploration' et 'Recherche'. Le mode 'Recherche' vous proposera de rechercher ou de filtrer les entités et les zones de la salle. Le mode 'Exploration' vous permettra de vous déplacer librement dans la salle.",
        noEntitiesFound: "Aucune entité trouvée dans la carte 🙅‍♂️",
        entitiesFound: "Entités trouvées",
        noAreasFound: "Aucune zone trouvée dans la carte 🙅‍♀️",
        areasFound: "Zones trouvées",
        noDescriptionFound: "No description found 🫥",
        details: {
            close: "Fermer",
            moveToEntity: "Aller à l'entité {name}",
            moveToArea: "Aller à la zone {name}",
            errorMovingToObject: "L'objet n'est pas accessible pour le moment 🚫",
        },
    },
    listRoom: {
        isFetching: "Récupération des salles en cours...⤵️",
        noRoomFound: "Aucune salle trouvée 🙅‍♂️",
        items: "{countEntity} objets / {countArea} zones",
        close: "Fermer",
        movingToRoom: "En partance pour la salle : {roomNameSelected}... À très vite... 🫡",
        searchLabel: "Chercher une salle",
        searchPlaceholder: "Par nom ou description...",
    },
};

export default mapEditor;
