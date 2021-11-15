# Messenger Clone

    https://teach-vue-chat-build-hosted.glitch.me/

## 1. Architecture *(15 pts)*

## 2. Fonctionnement général *(15 pts)*

### 2.1 Création d'un utilisateur en base de données *(5 pts)*

### 2.2 Attribution d'un token d'authentification *(10 pts)*

## 3. Communication avec le client *(30 pts)*

### 3.1 Les codes de retour

Lors de votre réponse, vous devrez préciser un code dans votre message de retour. Les possibilitées pour ce code sont les suivantes : 
- SUCCESS (tout s'est bien déroulé)
- NOT_AUTHENTICATED (dans le cas ou un utilisateur n'est pas connecté)
- NOT_FOUND_USER (l'utilisateur spécifié n'as pas été trouvé dans la base)
- NOT_FOUND_CONVERSATION
- NOT_FOUND_MESSAGE
- NOT_VALID_USERNAMES (liste de noms d'utilisateur pour créer une conversation pas valide)
- NOT_VALID_CONTENT (contenu du message non valide, très généralement s'il est vide)

### 3.2 Contenu de la réponse envoyé au client

#### 3.3.1 Authentification *(2 pts)*

#### 3.3.2 Récupération de la liste d'utilisateurs *(2 pts)*

#### 3.3.3 Récupération ou création d'un conversation one to one *(4 pts)*

#### 3.3.4 Récupération ou création d'un conversation many to many *(4 pts)*

#### 3.3.5 Récupération de toutes les conversations *(2 pts*)

#### 3.3.6 Envoi de message dans une conversation *(8 pts*)

#### 3.3.7 Edition d'un message *(2 pts*)

#### 3.3.8 Répondre à un message *(2 pts*)

#### 3.3.9 Delete message *(2 pts*)

#### 3.3.10 Réagir à un message *(2 pts*)

### 3.4 La liste des évènement à envoyer *(20 pts)*

#### 3.4.1 Création d'utilisateur *(3 pts)*

#### 3.4.2 Création de conversation *(3 pts)*

#### 3.4.3 Nouveau message *(4 pts)*

#### 3.4.4 Conversation vue *(3 pts)*

#### 3.4.5 Réaction à un message *(3 pts)*

#### 3.4.6 Message édité *(3 pts)*

#### 3.4.7 Message supprimé dans une conversation *(3 pts)*
