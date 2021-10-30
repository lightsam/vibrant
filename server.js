const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const {
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const app = express()

const states = [
  { name: 'ab'},
  { name: 'cd'}
]

const StateType = new GraphQLObjectType({
  name: 'State',
  description: 'a state',
  fields: () => ({
    name: { type: GraphQLString }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    states: {
      type: new GraphQLList(StateType),
      description: 'List of states',
      args: {
        str: { type: GraphQLString }
      },
      resolve: (parent, args) => states.filter(s => s.name.includes(args.str))
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))
app.listen(5000, () => console.log('server running'))
