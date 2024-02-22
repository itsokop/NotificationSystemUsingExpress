import { db, Table } from './db.config.js'

// Create or Update users
import { v4 as uuid } from 'uuid';

const createOrUpdate = async (data = {}) => {
    /* 
    id will take data.id for updating something bcz previously we already have the id 
    whereas Math.floor(Date.now()) + "_" + uuid() will generate epoch unix timestamp the unique combo of date and uuid */

    const idFromUser = data.id
    const idFromServer = Math.floor(Date.now()) + "_" + uuid()

    const params1 = {
        TableName: Table,
        Key: {
            // id: parseInt(uuid)
            id: idFromUser || idFromServer
        }
    }

    try {
        const { Item = {} } = await db.get(params1).promise();

        if (idFromUser && Object.keys(Item).length === 0)
            return {success: false}
            const params = {
                TableName: Table,
                Item: { ...Item, ...data, id: idFromUser||idFromServer }
            }
        await db.put(params).promise()
        return { success: true }
    } catch (error) {

        return { success: false }
    }
}

// Read all users
const readAllUsers = async () => {
    const params = {
        TableName: Table
    }

    try {
        const { Items = [] } = await db.scan(params).promise()
        return { success: true, data: Items }

    } catch (error) {
        return { success: false, data: null }
    }

}

// Read Users by ID
const getUserById = async (value, key = 'id') => {
    const params = {
        TableName: Table,
        Key: {
            [key]: (value)
        }
    }
    try {
        const { Item = {} } = await db.get(params).promise()

        return { success: true, data: Item }
    } catch (error) {
        return { success: false, data: null }
    }
}

// Delete User by ID
const deleteUserById = async (value, key = 'id') => {
    const params = {
        TableName: Table,
        Key: {
            [key]: value
        }
    };
    try {
        // Check if the user exists before attempting deletion
        const existingUser = await getUserById(value);
        if (!existingUser.success) {
            return { success: false, message: 'Error finding user' };
        }
        if (!existingUser.data.id) {
            return { success: true, message: 'Id not found' };
        }

        // Attempt to delete the user
        await db.delete(params).promise();
        return { success: true, message: 'User deleted successfully' };
    } catch (error) {
        // Catch any unexpected errors
        console.error('Error deleting user:', error);
        return { success: false, message: 'Error deleting user' };
    }
};



export {
    createOrUpdate,
    readAllUsers,
    getUserById,
    deleteUserById
}