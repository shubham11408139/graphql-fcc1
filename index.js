import { ApolloServer }  from "apollo-server";
import { typeDefs } from './schema.js';
import _db from "./_db.js";

const resolvers = {
  Query: {
    reviews: () => _db.reviews,
    review: (_, args, context)=> _db.reviews.find((r)=>r.id == args.id),
    games: ()=>_db.games,
    game: (_, args, context) => _db.games.find((g) => g.id == args.id),
    authors: ()=>_db.authors,
    author: (_, args, context) => _db.authors.find((a) => a.id == args.id),
  },
  Game: {
    reviews: (parent) => _db.reviews.filter((r) => r.game_id === parent.id)  // parent m game ka object ayega jo uper query game se aa rha hai
  },
  Author:{
    reviews: (parent) => _db.reviews.filter((a) => a.author_id === parent.id)  // parent m game ka object ayega jo uper query game se aa rha hai
  },
  Review: {
    author(parent) {
      return _db.authors.find((a) => a.id === parent.author_id)
    },
    game(parent) {
      return _db.games.find((g) => g.id === parent.game_id)
    }
  },
  Mutation: {
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString()
      }
      _db.games.push(game)

      return game
    },
    deleteGame(_, args) {
      _db.games = _db.games.filter((g) => g.id !== args.id)

      return _db.games
    },
    updateGame(_, args) {
      _db.games = _db.games.map((g) => {
        if (g.id === args.id) {
          return { ...g, ...args.edits }
        }

        return g
      })

      return _db.games.find((g) => g.id === args.id)
    }
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
