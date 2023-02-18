
import {Box, Button, Text, Center, FormControl, Input, FormLabel, FormErrorMessage, FormHelperText,} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'

export default function signInForm() {

    function validateUser(username) {
        let error 
        if (username === '') {
            error = "Username is undefined"
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

    return (
        <div>
            <Text padding="2px" fontWeight='bold' fontSize="45px" top={0} left={0}>Bibliotheca</Text>
            <br />
        
        <Center >
        
        <Box m={[10, 100]} boxShadow="2xl" rounded='md' p='7' padding="20px" borderRadius='3xl' textAlign="center">
        <Text marginBottom="40px" fontWeight='bold' fontSize="2em"marginRight="9px;">Sign In</Text>
        <Formik
            initialValues={{ username: '', password:'' }}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                console.log("Details are submitted")
                actions.setSubmitting(false)
                }, 1000)
            }}
            >
                {(props) => (
                    <Form>
                        <Field name='username' validate={validateUser}>
                            {({field, form}) => (
                                <FormControl isInvalid={form.errors.username && form.touched.username}>
                                    <FormLabel textAlign="center" w="400px" padding="3px">Username</FormLabel>
                                    <Input {...field} placeholder='Username'  marginBottom="2px"/>
                                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <br /><br />
                        <Field name='password' validate={validatePassword}>
                            {({field, form}) => (
                                <FormControl isInvalid={form.errors.password && form.touched.password}>
                                    <FormLabel textAlign="center" marginBottom= "10px" padding="3px">Password</FormLabel>
                                    <Input {...field} placeholder="Password"/>
                                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Link href="/"><Text as="u"> Don't have an account </Text></Link><br /><br /><br />
                        <Button
                            w="200px"
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='Sign in'
                            >
                            Submit
                        </Button>
                    </Form>
                )}
                
        </Formik>
        </Box>
        </Center>
        </div>

    )
}