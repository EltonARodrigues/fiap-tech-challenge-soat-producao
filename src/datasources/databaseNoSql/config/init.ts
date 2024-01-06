import { connect } from 'mongoose';




export default async function connectDB(dbHost:string, dbPort:string, dbName: string) {
    try {
        await connect(`mongodb://${dbHost}:${dbPort}/${dbName}`); // TODO
        console.log('Connected to MongoDB');

    } catch(err) {
        console.error(`cMongoDB connection error: ${err}`)
    }
}
