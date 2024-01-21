import { connect } from 'mongoose';




export default async function connectDB(dbHost:string, dbPort:string, dbName: string) {
    try {
        console.log(`mongodb://${dbHost}:${dbPort}/${dbName}`)
        await connect(`mongodb://${dbHost}:${dbPort}/${dbName}`,{
            retryWrites: false
        });
        console.log('Connected to MongoDB');

    } catch(err) {
        console.error(`cMongoDB connection error: ${err}`)
        await connectDB(dbHost, dbPort, dbName);
    }
}
