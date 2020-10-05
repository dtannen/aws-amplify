 import Amplify, { API, graphqlOperation } from "@aws-amplify/api";

 import awsconfig from "./aws-exports";
 import { createTodo } from "./graphql/mutations";
 import { listTodos } from "./graphql/queries";
 import { onCreateTodo } from "./graphql/subscriptions";

 Amplify.configure(awsconfig);

 async function createNewTodo() {
   const todo = {
     name: "T-rex",
     // image: `Realtime and Offline (${new Date().toLocaleString()})`,
     image: "https://vignette.wikia.nocookie.net/adoptme/images/f/f8/T-Rex.png/revision/latest?cb=20201003004901",
     rarity: "Legendary",
     count: 0
   };

   return await API.graphql(graphqlOperation(createTodo, { input: todo }));
 }

 async function getData() {
   API.graphql(graphqlOperation(listTodos)).then((evt) => {
     evt.data.listTodos.items.map((todo, i) => {
       QueryResult.innerHTML += `<p>${todo.name} - ${todo.image} - ${todo.rarity} - ${todo.count}</p>`;
     });
   });
 }

 const MutationButton = document.getElementById("MutationEventButton");
 const MutationResult = document.getElementById("MutationResult");
 const QueryResult = document.getElementById("QueryResult");
 const SubscriptionResult = document.getElementById("SubscriptionResult");

 MutationButton.addEventListener("click", (evt) => {
   createNewTodo().then((evt) => {
     MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.image} - ${evt.data.createTodo.rarity} - ${evt.data.createTodo.count}</p>`;
   });
 });

 API.graphql(graphqlOperation(onCreateTodo)).subscribe({
   next: (evt) => {
     const todo = evt.value.data.onCreateTodo;
     SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.image} - ${todo.rarity} - ${todo.count}</p>`;
   },
 });

 getData();
