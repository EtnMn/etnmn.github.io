---
layout: post
title: "Création d'une Azure function connectée à une Azure Table"
date: 2018-12-12 18:00:00 +0000
tags: Azure .NET Core
image:
  thumbnail: /images/azure-function-th.jpg
---

# Création d'une Azure function connectée à une Azure Table

Une _Azure function_ permet d'exécuter du code dans le cloud _Azure_, sans se soucier de créer une application complète ni de gérer l'infrastructure sur laquelle le code va s'exécuter. Il existe [différents modèles](https://docs.microsoft.com/fr-fr/azure/azure-functions/functions-overview#what-can-i-do-with-functions) d'_Azure function_, dont le **HTTPTrigger** qui permet de déclencher l'exécution d'un code sur une requête _HTTP_.

L'objectif ici est de développer une première _Azure function_, en utilisant _Visual Studio_ et _.NET Core_. Cette fonction aura pour objectif de réceptionner des demandes sous forme de _Ticket_, de les vérifier, puis de les stocker dans une table.

> Le code présenté est disponible sur [Github](https://github.com/EtnMn/TicketsFunctionApp)

## Prérequis

* Disposer d'un [abonnement _Azure_](https://azure.microsoft.com/fr-fr/free/?WT.mc_id=A261C142F)
* Installer Visual Studio 2017 en incluant au minimum les charges de travail: _Développement Azure_ et _Développement multiplateforme .NET Core_

> Important: Une fois _Visual Studio_ installé, aller dans le menu _Outils > Extensions et mises à jour..._ et vérifier que l'extension _Outils Azure Functions et Web Jobs_ et bien installée et à jour.

## Mise en place

### Création du projet

_Visual Studio_ contient un modèle pré-configuré pour le déploiement d'_Azure Function_. Il permet de créer une  **Function App**, qui est un regroupement d'_Azure Functions_

1. Dans le menu _Fichier_ de _Visual Studio_, sélectionner _Nouveau > Projet_.
2. Dans la boîte de dialogue _Nouveau projet_, déplier la catégorie _Installé > Visual C# > Cloud_ et sélectionner _Azure Functions_
3. Lui donner un nom (ici _TicketsFunctionApp_) et valider
4. Dans la boite de dialogue _Nouveau Projet_, indiquer les valeurs suivantes:
    * Version: _Azure Functions 2.x (.NET Core)_, afin de prendre en charge le .NET Core, contrairement à la version 1.x qui prend en charge .NET Framework.
    * Modèle: _Déclencheur HTTP_, afin de déclencher l'appel fonction via une requête _HTTP_
5. Compte de stockage: _Aucun_, cette option n'est pas nécessaire dans le cadre des déclencheurs _HTTP_
6. Droits d’accès: _Function_, pour spécifier une clé d'utilisation
![Nouveau projet Azure function]({{ "/images/azure-function-nouveau-projet.jpg" | absolute_url}})

7. Valider la boite de dialogue en appuyant sur _OK_

Le projet est à présent créé. On peut voir dans ses références que le _NuGet_ _Microsoft.NET.Sdk.Functions_ a été chargé. C'est ce dernier qui va permettre à la compilation de générer le fichier de configuration: _function.json_, à partir des attributs des classes et méthodes. Deux autres fichiers ont été créés:

1. _host.json_: contient les options de configuration globale qui affectent l’ensemble des fonctions d’une _Function App_. Par défaut, seule la version du _runtime_ est indiquée: _2.0_
2. _local.settings.json_: le fichier de paramètres local stocke les paramètres pour l’exécution locale. Ces paramètres ne sont pas publiés sur _Azure_. Ce fichier est par défaut exclu du contrôleur de code source.

### Test en local

Il est possible d'exécuter le projet en local en appuyant sur _F5_. Des outils complémentaires, tels que **Azure Functions Core Tools** sont nécessaires, _Visual Studio_ devrait en proposer l'installation à ce moment là. L'installation peut être vérifiée dans une console, en faisant `npm list -g --depth=0`. Une console s'ouvre ensuite, listant les étapes de compilation et, à la fin, l'adresse locale permettant d'accéder à la fonction, à recopier dans un navigateur (par exemple: `http://localhost:7071/api/Function1`). Par défaut aucun paramètre n'étant indiqué, un message de requête incorrecte est retournée, si par contre on ajoute `?name=toto` à la fin, on obtient le message d'acquittement.

## Création du model

Un _Ticket_ est représenté par le modèle suivant:

```c#
public class Ticket
{
    [Required]
    [StringLength(50)]
    public string Title { get; set; }

    [MaxLength(32000)]
    public string Content { get; set; }

    [Range(1, 4)]
    public int Priority { get; set; }
    
    [Required]
    public DateTime CreationDate { get; set; }
}
```

Les annotations permettront de valider les tickets reçus.

## Personnaliser la fonction

En premier lieu, renommer la classe _Function1_ en _FunctionCreateTicket_, faire de même pour l'attribut _FunctionName_ de cette classe.

> Modifier le nom de la fonction change le point de terminaison et donc la route par défaut.

Dans les paramètres de l'attribut _HttpTrigger_ de la méthode _Run_, supprimer le "_get_" afin de spécifier que la fonction n'utilise que la méthode _POST_. Vider le corps de la méthode, il sera personnalisé par la suite. Renommer la méthode en _CreateTicket_.

Pour la validation des _HttpRequest_, on peut reprendre l'idée de [Tsuyoshi Ushio](https://medium.com/@tsuyoshiushio/how-to-validate-request-for-azure-functions-e6488c028a41), qui consiste à utiliser _System.ComponentModel.DataAnnotations_. De cette validation dépendra la valeur de retour.

```c#
[FunctionName("CreateTicket")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
    ILogger log,
    ExecutionContext context)
{
    var body = await new StreamReader(req.Body).ReadToEndAsync();
    var model = JsonConvert.DeserializeObject<Ticket>(body, new JsonSerializerSettings());
    var results = new List<ValidationResult>();
    if (Validator.TryValidateObject(model, new ValidationContext(model, null, null), results, true))
    {
        return new OkObjectResult(model);
    }
    else
    {
        var errorMessages = results.Select(r => r.ErrorMessage);
        return new BadRequestObjectResult("Please pass a valid ticket in the request body. " + string.Join(" ", errorMessages));
    }
}
```

## Postman

A présent que seule la méthode _POST_ est utilisée, il n'est plus possible de passer par un navigateur pour tester la fonction, il est nécessaire de passer par un autre outil. Celui qui est le plus souvent utilisé pour tester des requêtes est ![Postman](https://www.getpostman.com/).

1. Installer _Postman_ et le démarrer
2. Copiez l'URL de la fonction dans Postman.
3. Sélectionner la méthode _POST_
4. Dans *Body* > *Raw*, recopier le corps _JSON_ ci dessous
```json
{
	title: "Créer une Azure function",
	content: "Je voudrais créer une Azure function capable de gérer des tickets.",
	Priority: 2,
	creationDate: "2018-10-12T18:25:43.511Z"
}
```
5. Cliquer sur _Send_. Le code *200* et le corps du ticket sont retournés

## Publier 

Pour publier vers _Azure_:

1. Faire un clic droit sur le projet dans l’_Explorateur de solutions_, puis _Publier..._
2. Pour le moment, aucun profil de déploiement ne devrait être disponible. Cliquer sur _Publier_
3. Renseigner les différentes valeurs demandées par l'**App service**, en créant un nouveau groupe de ressources et un compte de stockage.

![Créer l'app service]({{ "/images/azure-creer-app-service.jpg" | absolute_url}})

4. Aller sur le portail _Azure_, dans le groupe de ressource: _Ticket_, _App service_: _TicketsFunctionApp20181212033453_
5. Cliquer sur la fonction _CreateTicket_ puis sur le lien _</> Get function URL_ pour obtenir l'URL et le code à utiliser dans Postman

## Stocker les tickets dans une Azure Table

A la réception d'un ticket valide, on stocke ses valeurs dans une table afin de les exploiter à posteriori. _Azure Table_ permet un stockage sous forme de _clé / valeur_, qui sans offrir la richesse d'une _API SQL_, permet de réaliser des opérations de type _CRUD_ de façon simple et performante.

### Créer la table

Dans le portail _Azure_, chercher le groupe de ressource _Ticket_ créé précédemment. Il doit contenir le compte de stockage _ticketsstore_. Ce dernier contient plusieurs services dont _Tables_. Cliquer sur le bouton _Add table_, nommer la table: _Tickets_. Dans la section _Access key_, noter la chaîne de connexion afin de la renseigner dans le code de la fonction.

![Ajouter une Azure Table]({{ "/images/azure-ajouter-table.jpg" | absolute_url}})

### Modifier le modèle

Pour être sauvegardé dans la table, un objet _Ticket_ doit hériter de `TableEntity`. Dans le constructeur, initialiser:

1. PartitionKey: forcée à une valeur et de ne pas partitionner les données sur plusieurs serveurs.
2. RowKey: la clé primaire, générée automatiquement

```c#
public class Ticket : TableEntity
{        
    public Ticket()
    {
        PartitionKey = "tickets";
        RowKey = Guid.NewGuid().ToString("N");
    }      

    [Required]
    [StringLength(50)]
    public string Title { get; set; }

    [MaxLength(32000)]
    public string Content { get; set; }

    [Range(1, 4)]
    public int Priority { get; set; }

    [Required]
    public DateTime CreationDate { get; set; }
}
```

### Écriture en base

Pour écrire en base, l'application doit connaître la chaîne de connexion de la table. Celle dernière doit être stockée dans:

1. le fichier **local.settings.json** pour le développement local

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet",
    "azureTableConnectionString": "DefaultEndpointsProtocol=..."
  }
}
```

2. les options de l'application pour _Azure_

![Application settings]({{ "/images/azure-application-settings.jpg" | absolute_url}})

La récupération des settings est réalisée à partir d'une instance de `IConfigurationRoot`:

```c#
IConfigurationRoot config = new ConfigurationBuilder()
    .SetBasePath(context.FunctionAppDirectory)
    .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();

string connectionString = config["azureTableConnectionString"];
```

Pour l'écriture en elle même, on utilise une `TableOperation` de type _Insert_.

```c#
private static async Task CreateTicket(string connectionString, Ticket ticket, ILogger log)
{
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
    CloudTable table = tableClient.GetTableReference("Tickets");
    TableOperation insertOperation = TableOperation.Insert(ticket);
    await table.ExecuteAsync(insertOperation);
    log.LogInformation($"Ticket: {ticket.Title} saved");
}
```

Les enregistrements sont visibles dans le portail _Azure_: _Ressource group: Ticket > ticketstore > Storage Explorer > Tables > Tickets_. Redéployer l'application avant d'effectuer ce dernier test.