const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const {
  GraphQLFloat,
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const app = express()

const states = [
  { name: 'Alabama', lat: 32.318231, lng: -86.902298 },
  { name: 'Arkansas', lat: 35.20105, lng: -91.831833 }
  // { name: 'ab', kml_url: 'https://github.com/lightsam/files/blob/master/example.kml?raw=true' },
  // { name: 'cd', kml_url: 'https://github.com/lightsam/files/blob/master/example.kml?raw=true' }
]

const StateType = new GraphQLObjectType({
  name: 'State',
  description: 'a state',
  fields: () => ({
    name: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
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
      resolve: (parent, args) => states.filter(s => s.name.toLowerCase().includes(args.str.toLowerCase()))
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
