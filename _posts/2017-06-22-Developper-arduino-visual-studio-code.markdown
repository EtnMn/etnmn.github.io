---
layout: post
title:  "Developper pour arduino dans Visual Studio- Code"
date:   2017-06-22 22:28:00 +0000
tags: arduino iot
image:
  path: /images/ArduinoVisualStudioCode.jpg
  thumbnail: /images/ArduinoVisualStudioCode-th.jpg
---
Si l'environnement de développement Arduino permet de découvrir la plateforme et de créer ses premiers projets très facilement, il montre rapidement ses limites en comparaison d'autres IDE. A l'inverse, Visual Studio Code est un éditeur léger, multiplateformes et surtout personnalisable au travers de nombreuses extensions dont certaines spécifiques au développement Arduino.

## Mise en place

La première étape est de télécharger, depuis le [site de l'éditeur](https://www.arduino.cc/en/Main/Software), l'environnement de développement Arduino puis de l'installer (A noter que la version *Window app* n'est pas compatible). Les bibliothèques de cette application seront en effet utilisées par Visual Studio Code pour compiler et communiquer avec le matériel.

Deuxième étape, [installer](https://code.visualstudio.com/) l'extension. Ouvrir le gestionnaire d'extensions (*Ctrl-Maj-X *) puis inscrire *arduino* dans le moteur de recherche afin de lister les extensions disponibles. Je me suis personnellement orienté vers la [version éditée par Microsoft](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-arduino). Pour l'installation, cliquer sur le bouton *Installer* puis suivre les instructions.

## Configuration

La configuration de l'extension peut se faire à deux niveaux:

 	* User: les options seront globales à tous les projets VSCode
 	* Workspace: les options ne seront valables que pour l'espace de travail courant (Informations sauvegardées dans le répertoire *.vscode*, à la racine du projet courant)


La liste des options est visible dans les *User settings (Ctrl+Shift+P)*. A noter que pour une configuration standard, cette étape n'est pas nécessaire, les valeurs par défaut répondant au besoin. Il est également possible de vérifier les chemins dans le fichier *c_cpp_properties.json* du *workspace*. En cas de modification, penser à redémarrer VSCode.

## Blink

Les exemples Arduino sont accessibles dans VSCode à partir de la palette de commande *(Ctrl+Shift+P)* via la commande *Arduino: Examples* et choisir *Built-in Examples/01.Basics/Blink*. Le fait d'ouvrir un exemple copiera le code dans un répertoire *generated_examples*, aucun risque donc de corrompre le code d'origine. Avant de pouvoir transférer le code sur le matériel, il reste à configurer la carte et le port de communication. Plusieurs possibilités pour cela:

* Ouvrir le fichier *arduino.json* et renseigner les champs *board* et *port*
* Utiliser la commande *Arduino:Board config*
* Utiliser la barre de statut en bas de la fenêtre et cliquer sur *Select Board Type* puis choisir la carte voulue dans la liste déroulante puis sur le port en sélectionnant celui utilisé par l'Arduino (il doit être branché)

La configuration est sauvegardée dans le fichier *arduino.json* du *workspace*.

Pour transférer le code, utiliser la commande *Arduino: Upload* (ou *Ctrl+Alt+U*). La fenêtre *Output* confirme le transfert et la led interne doit à présent clignoter.

## Moniteur Série

Pour tester la lecture et l'écriture sur le port série, il suffit de modifier légèrement un exemple trouvé sur le [site d'arduino](https://www.arduino.cc/en/Serial/Read):

```c
char incomingChar;

void setup()
{
  // Configuration de la transmission.
  Serial.begin(9600);
}

void loop()
{
  // Si donnée en attente.
  if (Serial.available() > 0)
  {
    // Lecture du caractère.
    incomingChar = Serial.read();

    // Renvoi du caractère.
    Serial.print("I received: ");
    Serial.println(incomingChar);
  }
}
```

Avant d'exécuter, il faut vérifier la cohérence de la vitesse de transfert du moniteur série avec le code via la commande *Arduino: Change Baup Rate*. Dans le cas présent on indique 9600 bauds. Pour ouvrir le moniteur Arduino, il est nécessaire que le matériel soit connecté et que le port *COM* soit configuré. Plusieurs possibilités ensuite:


 	* La commande *Arduino: Open Serial Monitor*
 	* L'icone représentant une prise électrique dans la barre de statut
 	* Le panneau *Sortie*, option *Serial Monitor*


De même pour arrêter le moniteur:

 	* La commande *Arduino: Close Serial Monitor*
 	* L'icone représentant une croix, située à droite de la vitesse de transmission dans la barre de statut


Une fois le code téléchargé, on peut envoyer un message depuis le PC avec la commande *Arduino: Send Text to Serial Port*, à la suite de quoi le caractère est retourné et affiché dans le moniteur série.

![Envoi d'un caractère sur le port série]({{ "/images/SendTextToSerialPort.jpg" | absolute_url}})

## Chargement des librairies

L'ajout de librairies tierces est semblable au fonctionnement de l'application Arduino classique. Visual Studio Code récupère le chemin du répertoire de travail de l'utilisateur et stocke les librairies téléchargées dans le répertoire *librairies*. Lorsqu'une librairie est ajoutée à un projet, le chemin d'accès est sauvegardé dans le fichier *c_cpp_properties.json*. L'IHM de gestion des bibliothèques s'ouvre avec la commande *Arduino: Library Manager.*

## Conclusion

Le plugin Arduino pour Visual Studio Code permet de profiter de tous les avantages d'un éditeur de code moderne (raccourcis claviers, onglets, personnalisation, accès rapide aux sources...) tout en conservant les fonctionnalités proposées par l'éditeur standard. Si son appropriation peut dérouter un utilisateur novice, l'effort sera récompensé sur le long terme par une productivité accrue.