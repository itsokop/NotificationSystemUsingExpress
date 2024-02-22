import express from 'express'
import { createOrUpdate, deleteUserById, getUserById, readAllUsers } from './db.js'

const router = express.Router()

// READ ALL Users
router.post('/users', async(req, res) => {
    const { success, data } = await readAllUsers()

    const filterData = data.filter(item => item.userId == req.body.userId )
    const modifiedData = filterData.map(item => ({...item, userId: undefined}))

    if(success){
        return res.json({success, data: modifiedData})
    }
    return res.status(500).json({success:false, messsage: "Error"})
})

// Get User by ID
router.get('/user/:id', async(req, res) => {
    const { id } = req.params
    const { success, data } = await getUserById(id)
    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: "Error"})
})


// Create User
router.post('/user', async(req, res) => {
    const { success, data } = await createOrUpdate(req.body)

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: 'Error'})
})


// Update User by ID
router.put('/user/:id', async(req, res) => {
	const {id} = req.params
    const user = {...(req.body), id}

    const { success, data } = await createOrUpdate(user)

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: true, message: "Error aana chaiye bcz id doesn't exist!"})
})


// Delete User by Id
router.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Attempt to delete the user
        const deletionResult = await deleteUserById(id);

        // Determine the response based on deletion result
        return res.json(deletionResult);
    } catch (error) {
        // Catch any unexpected errors
        console.error('Error deleting user:', error);
        return res.status(500).json({ success: false, message: 'Unexpected error occurred' });
    }
});




export default router