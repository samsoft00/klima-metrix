# klima-metrix-task

## Part 1

Our backend stores profiles of companies, which can be part of a supply chain. The stored objects are looking like this:

```json
{
    "id": 100,
    "label": "Microsoft Ltd.",
    "country": "us",
    "revenue": 3000,
    ...
}
```

To analyse a supply chain we are receiving of a list of companies a customer is dealing with. This list looks like this:

```json
[
    {
    "name": "Microsoft",
    "type": "suply",
    ...
    },
    {
    "name": "Klima.Metrix GmbH",
    "type": "partner",
    ...
    },
    ...
]
```

We need to check if we already have data for every company in the list. One problem is, that the name field is filled out manually on the customer side, so it can contain typos or differnt spelling e.g. MSFT, Microsoft, Microsoft Ltd, Microssoft.

Develop a script in JavaScript / TypeScript, which takes a list campanies and checks them against the existing database in a smart way. Create the testing data by yourself. Additionally think about a concept how this can be improved in the future. Take into consideration, that we are parsing many lists, with hunderts of campanies every day.

## Part 2

The task above is only one step of processing the customers data. Build an API, which allows to upload a csv file containing the list of companies of a customer. The upload should trigger a step based procssing. Simulate 5 steps, which all should take 30 - 120 seconds and add your code from above as a 6. and last step. Aditonally allow the user (a Single Page Frontend Application, which is not part of this task) to check the progress. Store results + our company knowledge in a database.
