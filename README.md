# klima metrix tasks

| :----------------------------------------------------------------------------------: |
| ![](https://github.com/samsoft00/klima-metrix-task/blob/master/doc/architecture.png) |

## Part I

> Develop a script in JavaScript / TypeScript, which takes a list campanies and checks them against the existing database in a smart way. Create the testing data by yourself. Additionally think about a concept how this can be improved in the future. Take into consideration, that we are parsing many lists, with hunderts of campanies every day.

[Link to the script](https://github.com/samsoft00/klima-metrix-task/blob/master/src/lib/sanitizeData.ts)

## Part II

> The task above is only one step of processing the customers data. Build an API, which allows to upload a csv file containing the list of companies of a customer. The upload should trigger a step based procssing. Simulate 5 steps, which all should take 30 - 120 seconds and add your code from above as a 6. and last step. Aditonally allow the user (a Single Page Frontend Application, which is not part of this task) to check the progress. Store results + our company knowledge in a database.

```
npm run i
```

```
Base URL : http://localhost:3000
Upload API : /v1/api/upload
Upload process status API : /v1/api/upload/:processId
```

**To start server**

```
npm run start:local:dev
```

**To start worker**

```
npm run start:local:worker
```

Kindly start redis server for the worker to run.

[Link to sample CSV file](https://github.com/samsoft00/klima-metrix-task/blob/master/doc/robots.csv)

|                                          CSV upload response                                           |                                        Upload status response                                        |
| :----------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: |
| ![Upload response](https://github.com/samsoft00/klima-metrix-task/blob/master/doc/upload-response.png) | ![Process Status](https://github.com/samsoft00/klima-metrix-task/blob/master/doc/process-status.png) |
