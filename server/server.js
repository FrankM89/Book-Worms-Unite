const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors"); // import cors package
const path = require("path");
const db = require("./config/connection");

const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(cors()); // enable CORS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define Apollo server middleware before static asset middleware
server.applyMiddleware({ app });

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Start the server
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
