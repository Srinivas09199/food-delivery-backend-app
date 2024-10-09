const testUserController = async (req, res) => {

    try {
        res.status(200).send('Testing API KEY')
    } catch (error) {
        console.log('error In Test API', error)
    }
}

module.exports = {testUserController} 