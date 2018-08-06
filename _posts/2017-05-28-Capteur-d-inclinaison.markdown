---
layout: post
title:  "Capteur d'inclinaison"
date:   2017-07-28 22:45:00 +0000
categories: arduino iot
---
Les capteurs d'inclinaison (ou Tilt sensor en anglais) sont des composants électroniques de petite taille et peu coûteux capables de changer d'état au delà d'un certain angle d'inclinaison. Le principe est simple, en position verticale le capteur se comporte comme un interrupteur normalement fermé, mais lorsque son inclinaison évolue au delà d'une certaine valeur, le contact mécanique (1 ou 2 billes ou du mercure) se déplace et ouvre le circuit. Dans le commerce on trouve ce genre de capteur sous deux formes:
* le capteur nu, par exemple la référence SW-520D,
* le capteur plus un module dédié (généralement un trigger de Schmitt permettant notamment de filtrer les rebonds).

Voulant détecter le passage d'un objet, j'ai choisi de partir de la version sans module dont un exemplaire s'ennuyait au fond d'une boîte. Le capteur sera monté verticalement et donc fermé au repos. Au passage d'un objet il sera entrainé vers le bas, déclenchant une action (émission d'un son, allumage d'une led...).

## Montage
Les caractéristiques du SW-520D sont en adéquation avec celles de l'Arduino (Tension maximale 12V, courant maximal 20mA). Concernant le buzzer, le courant mesuré pour 5V est de ~ 10mA. Au final, il n'y a pas besoin de prendre de précaution particulière. Par contre, à l'utilisation l'actionneur se révèle très sensible aux rebonds et des détections peuvent être remontées sans que l'inclinaison du composant n'ait atteint 45°. Par conséquent le montage présenté utilise un filtre RC dans le but d'atténuer ce comportement. Les caractéristiques de ce dernier sont classiques:
* une résistance de 10kΩ qui servira également de pull-up,
* un condensateur de 10nF.

Lorsque le capteur passe en position ouvert, un son sera émis par le buzzer actif connecté à la broche n°8 de l'Arduino Uno.

![Branchement du composant SW-520D]({{ "/assets/images/tiltBuzzer.jpg" }})

## Code
L'expérimentation a montré que l'anti-rebond matériel géré par le filtre RC ne permet pas d'éviter des déclenchements intempestifs dus aux vibrations importantes. Il est donc nécessaire d'ajouter un anti-rebond logiciel qui ne déclenchera l'action que si l'état est tenu pendant une période de temps. Cette période a été définie à 100ms.


```c
const int tiltPin = 2;
const int buzzerPin = 8;

int previousTiltValue = LOW;
long switchTimeTiltValue = 0;
long debounce = 100;
bool soundReady = true;

void setup() {
    pinMode(buzzerPin, OUTPUT);
    pinMode(tiltPin, INPUT);
}

void loop() {
    int tiltValue = digitalRead(tiltPin);
    if (tiltValue != previousTiltValue) {
        switchTimeTiltValue = millis();
    }

    if ((millis() - switchTimeTiltValue) > debounce) {
        if (tiltValue && soundReady) {
            playActiveBeep();
            soundReady = false;
        }
        else if (!tiltValue && !soundReady) {
            soundReady = true;
        }
    }    previousTiltValue = tiltValue;
}

void playActiveBeep() {
    for (char i = 0; i > 100; i++) {
        digitalWrite(buzzerPin, HIGH);
        delay(1);
        digitalWrite(buzzerPin, LOW);
        delay(1);
    }
}
```

## Conclusion
Grace à  l'utilisation de l'anti-rebond logiciel, le capteur d'inclinaison semble pouvoir être utilisé efficacement dans un montage détectant le passage d'un objet mais cela restera à confirmer dans les essais ultérieurs. Par contre il n'est pas aisé de produire des mélodies avec le buzzer actif.
