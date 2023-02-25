
import {Box, Flex, Button, Text, Center, FormControl, Input, FormLabel, FormErrorMessage, FormHelperText,} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'

export default function AddLink() {

    function validateName(name) {
        let error;
        if (name === '') {
            error = "Name of Link cannot be Empty"
        }
        
        return error
    }

    function validateLink(link) {
        let error = ''
        if (link === '') {
            error = 'Link cannot be empty'

        }

        return link 
    }


    return (
        <div>
            <Box zIndex={4}>
            <Formik
            initialValues={{ name: '', link:'' }}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                console.log("Details are submitted")
                actions.setSubmitting(false)
                }, 1000)
            }}
            >{(props) => (
                <Form>
                    <Field name='name' validate={validateName}>
                        {({field, form}) => (
                            <FormControl isInvalid={form.errors.username && form.touched.username}>
                                <FormLabel>Name of Link</FormLabel>
                                <Input {...field} placeholder='Name of Link' />
                                <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                    <Button 
                        mt={4}
                        colorScheme='teal'
                        isLoading={props.isSubmitting}
                        type='submit'>Add Link</Button>
                </Form>
            )}


            </Formik>
            </Box>
        </div>
    )


}