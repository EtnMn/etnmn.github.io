---
layout: post
title:  "Appui aérien rapproché"
date:   2017-04-18 22:47:00 +0000
tags: VBS2
image:
  path: /images/M2000.jpg
  thumbnail: /images/M2000-th.jpg
---
Les scénarios de frappes aéroportées sont des simulations VBS2 difficiles à mettre en place et pour lesquels il est nécessaire de connaître les équipements compatibles et de comprendre leur fonctionnement. Cet article liste différentes mises en œuvre, allant de la frappe aérienne effectuée par un pilote d'A-10 à la désignation laser opérée par un FAC (Forward Air Controller).

Liste du matériel pour VBS2 1.6

<table>
<tbody>
<tr>
<th>Type</th>
<th>Véhicule compatible</th>
<th>Désignation</th>
</tr>
<tr>
<td>Non guidé</td>
<td>Mk82</td>
<td>F-15E; A-10A</td>
</tr>
<tr>
<td rowspan="2">Guidage laser</td>
<td>GBU-12</td>
<td>A-10A; AV-8B; CF-188A; F-15E; F-16C; F-35B; F/A-18; Tornado GR.4</td>
</tr>
<tr>
<td>AGM-65</td>
<td>AH-1Z; AH-64D; Apache AH.1; ARH; MQ-9 Reaper; OH-58D</td>
</tr>
<tr>
<td>Equipements</td>
<td colspan="2">Laser designator; Laser Marker; IZLID</td>
</tr>
</tbody>
</table>

## Frappe non guidée effectuée par un pilote

* Cible: X Ural 4320 (Covered) OPFOR
* Véhicule: A-10A - GAU-8 - Hydra - Mk82

La bombe *Mk82* s'accroche aux véhicules (ni personnage, ni bâtiment). Une fois aux commandes de *l'A-10*, appuyer plusieurs fois sur la barre espace afin de sélectionner la *Mk82*. Pour accrocher la cible, utiliser le *clic droit*. La cible est alors mise en évidence par une carré.

Afin de faciliter la phase d'approche, il est impératif de s'aligner à l'aide du radar. Il est également possible d'utiliser le GPS (*Ctrl+,*). La montre (*T*) s'avère également intéressante pour visualiser l'heure de la frappe.

## Frappe non guidée, simulée par un tir d'artillerie

* Cible: X Ural 4320 (Covered) OPFOR
* Artillery Strike: Placée à proximité de la cible.

Le déclenchement se fait en fonction du *TOT* (Time On Target) en utilisant un *Trigger radio* ou grâce à la commande: *dayTime &gt; 8.05* pour une frappe à 8h05.

## Frappe non guidée

 	* Cible: X Ural 4320 (Covered) OPFOR
 	* Véhicule: A-10A - GAU-8 - Hydra - Mk82

Utiliser un *waypoint* de type *Seek and Destroy* sur la cible. Les commandes suivantes peuvent être testées: *doTarget, fire, reveal*

## Frappe guidée effectuée par un joueur

* Cible: X Ural 4320 (Covered) OPFOR
* Véhicule: AV-8B - GAU-12 - GBU-12
* FAC: US SOCOM ACU: SF Soldier - Soflam équipé d'un laser designator

Le FAC contrôlé par l'IA désigne automatiquement le véhicule ennemi. Dans l'avion, sélectionner la *GBU-12*. La cible est désignée par un carré. Pour changer de cible, utiliser la touche *tabulation*.

## Tageting Pod

* Cible: X Ural 4320 (Covered) OPFOR
* FAC: US SOCOM ACU: SF Soldier - Soflam lié à un Control Link de type LITENING Targeting Pod
* Désignation effectuée par le Pod d'un AV-8B - GAU-12 - GBU-12

Lors du lancement de la mission, valider l'action *LITENING Targeting Pod*. Pour bloquer la vue sur une cible, utiliser la touche *L* puis *clic gauche* pour activer le pointage laser. Il est souvent plus simple de passer en mode de vue à la 3ème personnes pour aligner le *POD*.

## Frappe guidée désignée par un hélicoptère

* Cible: X Ural 4320 (Covered) OPFOR
* Hélicoptère: ARH- GIAT 30mm - Hydra - AGM114

Aux commandes de *l'ARH*, sélectionner le *Laser Designator* puis *clic droit* pour l'allumer. Sélectionner à présent les *Hellfires* puis faire un c*lic droit* pour aligner les cibles.