export default class Seeder {
    async run() {}
    async create(instance) {
        try {
            return await instance.save();
        } catch (e) {
            console.error(e);            
        }
    }
}