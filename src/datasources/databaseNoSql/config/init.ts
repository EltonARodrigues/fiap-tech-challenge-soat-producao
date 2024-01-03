import { connect } from 'mongoose';

export default async function connectDB() {
    try {
        await connect('mongodb://localhost:27017/PedidoDB'); // TODO
        console.log('Connected to MongoDB');

    } catch(err) {
        console.error(`cMongoDB connection error: ${err}`)
    }
}
