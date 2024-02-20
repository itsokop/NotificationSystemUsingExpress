import { db, Table } from './db.config.js'

// Create or Update users
import { v4 as uuid } from 'uuid';

const createOrUpdate = async (data = {}) => {
/* 
id will take data.id for updating something bcz previously we already have the id 
whereas Math.floor(Date.now()) + "_" + uuid() will generate epoch unix timestamp the unique combo of date and uuid */

    const id = data.id || Math.floor(Date.now()) + "_" + uuid() 
    const params1 = {
        TableName: Table,
        Key: {
            // id: parseInt(uuid)
            id
        }
    }
    
    try {
        const { Item = {} } = await db.get(params1).promise();

        const params = {
            TableName: Table,
            Item: { ...Item, ...data, id }
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
            [key]: (value)
        }
    }

    try {
        await db.delete(params).promise()
        return { success: true }

    } catch (error) {
        return { success: false }
    }
}


export {
    createOrUpdate,
    readAllUsers,
    getUserById,
    deleteUserById
}