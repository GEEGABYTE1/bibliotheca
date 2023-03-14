
import {Box, Button, Text, Center, FormControl, Input, FormLabel, FormErrorMessage, FormHelperText,} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import {createClient} from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function SignInForm() {
    
    const supabase = createClient(process.env.NEXT_PUBLIC_DB_URL, process.env.NEXT_PUBLIC_DB_KEY)
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

    async function addUser(rel_username) {
        const {error} = await supabase.from('data').insert({username: rel_username})
        console.log(error)
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
        <Head>
            <title>Bibliotheca</title>
        </Head>
        
        <Box height="900px" width="auto" backgroundImage="url('/images/Wallpaper2.png')" backgroundPosition="center" backgroundSize="cover"
  backgroundRepeat="no-repeat">
        <div>
            <Link href="/"><Text padding="10px" fontWeight='bold' fontSize="45px" top={0} left={0}>Bibliotheca</Text></Link>
            <br />
        
        <Center >
        
        <Box m={[10, 100]} boxShadow="2xl" rounded='md' p='7' padding="20px" borderRadius='3xl' textAlign="center">
        <Text marginBottom="40px" fontWeight='bold' fontSize="2em"marginRight="9px;">Create Your Account</Text>
        <Formik
            initialValues={{ username: '', password:'' }}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                console.log("Sample Value Data structure visual: ", values)
                alert("Account Created! Check your Email to Verify your Account 🥳")
                const rel_username = values['username']
                const rel_password = values['password']
                setUsername(rel_username)
                setPassword(rel_password)
                setbuttonSubmission(true)
                // Adding Users
                addUser(rel_username)
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
        </Box>
        </div>

    )
}