
import {Box, Button, Text, Center, FormControl, Input, FormLabel, FormErrorMessage, FormHelperText,} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import {createClient} from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export default function signInForm() {
    
    const supabase = createClient("https://vkulxphxyccehtzaqngk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdWx4cGh4eWNjZWh0emFxbmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcyMDIyNjMsImV4cCI6MTk5Mjc3ODI2M30.KiXG-sdddT_3sCP9lLGmF1iUsfkk8rK1ZebsDHae5LU")
    const [buttonSubmission, setbuttonSubmission] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function validateUser(username) {
        let error 
        if (username === '') {
            error = "Email is undefined"
        } 

        return error
    }

    function validatePassword(password) {
        let error = '' 
        if (password === '') {
            error = 'Password is undefined'
        }

        return error
    }

    async function signUpFunction() {
        const {data, error} = await supabase.auth.signUp({
            email: username,
            password: password
        })
        return data
    }

    useEffect(() => {
        if (buttonSubmission === true) {
            const result = signUpFunction()
            console.log("Username adding to Supabase :", username)
            console.log("Signing up Result: ", result)
            setbuttonSubmission(false)
        } 
    })

    return (
        <div>
            <Text padding="2px" fontWeight='bold' fontSize="45px" top={0} left={0}>Bibliotheca</Text>
            <br />
        
        <Center >
        
        <Box m={[10, 100]} boxShadow="2xl" rounded='md' p='7' padding="20px" borderRadius='3xl' textAlign="center">
        <Text marginBottom="40px" fontWeight='bold' fontSize="2em"marginRight="9px;">Create Your Account</Text>
        <Formik
            initialValues={{ username: '', password:'' }}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                console.log("Sample Value Data structure visual: ", values)
                //alert(JSON.stringify(values, null, 2))
                const rel_username = values['username']
                const rel_password = values['password']
                setUsername(rel_username)
                setPassword(rel_password)
                setbuttonSubmission(true)
                console.log("States are updated")
                
                actions.setSubmitting(false)
                }, 1000)
            }}
            >
                {(props) => (
                    <Form>
                        <Field name='username' validate={validateUser}>
                            {({field, form}) => (
                                <FormControl isInvalid={form.errors.username && form.touched.username}>
                                    <FormLabel textAlign="center" w="400px" padding="3px">Email</FormLabel>
                                    <Input {...field} placeholder='Email'  marginBottom="1px"/>
                                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <br />
                        <Field name='password' validate={validatePassword}>
                            {({field, form}) => (
                                <FormControl isInvalid={form.errors.password && form.touched.password}>
                                    <FormLabel textAlign="center" marginBottom= "10px" padding="3px">Password</FormLabel>
                                    <Input {...field} type="password" placeholder="Password"/>
                                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                </FormControl> 
                            )}
                        </Field>
                        <br />
                        <Button
                            w="200px"
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='Sign in'
                            >
                            Create
                        </Button>
                    </Form>
                )}
                
        </Formik>
        </Box>
        </Center>
        </div>

    )
}