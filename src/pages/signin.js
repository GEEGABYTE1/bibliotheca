
import {Box, Flex, Button, Text, Center, FormControl, Input, FormLabel, FormErrorMessage, FormHelperText,} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import {createClient} from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import {BsLink} from 'react-icons/bs'
import {AiOutlineFolderAdd} from 'react-icons/ai'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'




export default function signInForm() {
    const supabase = createClient("https://vkulxphxyccehtzaqngk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdWx4cGh4eWNjZWh0emFxbmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcyMDIyNjMsImV4cCI6MTk5Mjc3ODI2M30.KiXG-sdddT_3sCP9lLGmF1iUsfkk8rK1ZebsDHae5LU")
    // Sample Data Set
    const objects = [{id:'1', item:'beepboop'}, {id:'2', item:"bap"}, {id:'3',  item:"beemboom"}]
    const folders = [{id:'1', name:"Folder1"}, {id:'2', name:'Folder2'}, {id:'3', name:'Folder3'}]
    const colour_set = ["#d8e2dc", "#ffe5d9", '#ffcad4', '#f4acb7', '#9d8189']


    const [buttonSubmission, setbuttonSubmission] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [authStatus, setStatus] = useState(false)
    const [addLinkStats, setLinkStatus] = useState(false)
    const [addFolderStatus, setFolderStatus] = useState(false)
    const [objectArray, updateObjectArray] = useState(objects)
    const [folderArray, updateFolderArray] = useState(folders)
    const [data, setData] = useState([])


    function colouriterator(index) {
        if (index > colour_set.length) {
            index = 0 
        } 

        return index

    }


    function handleOnDragEnd(result) { 
        if (!result.destination) return;
        console.log(result)
        const items = Array.from(objectArray)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        updateObjectArray(items);
    }

    function handleOnDragEndFolder(result) {
        if (!result.destination) return;
        console.log("folder result", result)
        const folder_items = Array.from(folderArray)
        const [reorderedItem] = folder_items.splice(result.source.index, 1)
        folder_items.splice(result.destination.index, 0, reorderedItem)
        updateFolderArray(folder_items)
    }

    function validateUser(username) {
        let error 
        if (username === '') {
            error = "Username is undefined"
        } 

        return error
    }

    function validateName(name) {
        let error;
        if (name === '') {
            error = "Name of Link Cannot be Empty"
        }

        return error
    }

    function validateLink(link) {
        let error = ''
        if (link === '') {
            error = 'Link Cannot be Empty'
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


    function handleError() {
        setStatus(false)
        alert(`No Email '${username}' Found! ~ Please Sign up 😎`)
    }

    function handleLinkStatus(e) {
        e.preventDefault()
        if (addLinkStats === true) {
            e.preventDefault()
            setLinkStatus(false)
            e.preventDefault()
        } else if (addLinkStats === false) {
            e.preventDefault()
            setLinkStatus(true)
            e.preventDefault()
        }
        e.preventDefault()
        
    }

    function handleFolderStatus() {
        if (addFolderStatus === true) {
            setFolderStatus(false)
        } else if (addFolderStatus === false) {
            setFolderStatus(true)
        }
    }

    async function signInFunction() {
        await supabase.auth.signInWithPassword({
            email: username,
            password: password,
          }).then(
            result => {
                try {
                    console.log(result.data)
                    const auth_status = result.data['user']['aud']
                    console.log("Auth Status of User: ", auth_status)
                    setStatus(true)
                }
                catch (err) {
                    handleError()
                }
                
            }
          )  
    }

    function HomePage() {
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
                const rel_username = values['username']
                const rel_password = values['password']
                setUsername(rel_username)
                setPassword(rel_password)
                setbuttonSubmission(true)
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
                                    <FormLabel textAlign="center" w="400px" padding="3px">Email</FormLabel>
                                    <Input {...field} placeholder='Username'  marginBottom="2px"/>
                                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <br /><br />
                        <Field name='password' validate={validatePassword}>
                            {({field, form}) => (
                                <FormControl isInvalid={form.errors.password && form.touched.password}>
                                    <FormLabel textAlign="center" marginBottom= "10px" padding="3px"> Platform Password</FormLabel>
                                    <Input {...field} type="password" placeholder="Password"/>
                                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Link href="/signup"><Text as="u"> Don't have an account </Text></Link><br /><br /><br />
                        <Button
                            w="200px"
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='Sign in'
                            >
                            Sign In
                        </Button>
                    </Form>
                )}
                
        </Formik>
        </Box>
        </Center>
        </div>
        )
    }

    function SuccessSignIn (props) {
        return (
            <div>
                {addLinkStats?<LinkForm />:console.log("Link View is Dismissed")}
                {addFolderStatus?<FolderForm />:console.log("Folder View is Dismissed")}
                <Text padding="2px" fontWeight='bold' fontSize="30px" top={0} left={0}>Welcome {props.username}!</Text>
                // View for bookmarks and Folders

                
                <Center>
                <Box zIndex={1} textAlign="center"  display="flex" padding="100px" h="auto" w="auto" flexDirection="row">
                <Box zIndex={1} boxShadow="2xl" borderRadius="20px" padding="10px">
                <Text marginBottom='20px' fontWeight='bold' fontSize='20px'> Folders </Text>
                <DragDropContext onDragEnd={handleOnDragEndFolder}>
                    <Droppable droppableId="folders">
                        {(provided) => (
                            
                            <div className="folders" {...provided.droppableProps} ref={provided.innerRef}>
                                
                                {folderArray.map((object, index) => {
                                    {console.log(object.id)}
                                    return (
                                        
                                            <Draggable key={object.id} draggableId={object.id} index={index}>
                                            {(provided) => (
                                                
                                                <Box zIndex={1} key={object.id} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} border="solid" borderRadius="20px" bgColor={colour_set[colouriterator(index)]} h="70px" w="500px" marginBottom="20px">
                                                    <h3>{object.name}</h3>
                                                </Box>
                                            )}
                                        </Draggable>
                                            
                                        
                                        
                                       
                                    )
                                })}
                                {provided.placeholder}

                            </div>
                            
                        )}
                    </Droppable>
                </DragDropContext>
                </Box>
                

                
                <Box zIndex={1} padding="10px" boxShadow="2xl" borderRadius="20px" marginLeft="40px">
                <Text marginBottom='20px' fontWeight='bold' fontSize='20px'> Links </Text>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="objects">
                        {(provided) => (

                            <div className="objects" {...provided.droppableProps} ref={provided.innerRef}>
                                
                                {objectArray.map((object, index) => {
                                    {console.log(object.id)}
                                    return (
                                        <div>
                                            <Draggable key={object.id} draggableId={object.id} index={index}>
                                            {(provided) => (
                                 
                                                <Box zIndex={1} key={object.id} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} border="solid" borderRadius="20px" bgColor={colour_set[colouriterator(index)]} marginBottom="20px" h="70px" w="500px">
                                                    <h3>{object.id}</h3>
                                                </Box>
                                            )}
                                        </Draggable>
                                            
                                        
                                        </div>
                                       
                                    )
                                })}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                </Box>
                
                </Box>
                </Center>
                
                
                
              
                

                    
        









                <Center > 
                <Box pos="fixed" bottom="7" bgColor="tomato" borderColor='tomato' color="white" display="flex" columnGap="50%" alignItems="center" justifyContent="center" padding="5px"  borderRadius='lg'  w='30%'>
                     <Button type='button' size="lg" colorScheme='gray.200' variant="ghost" leftIcon={<BsLink />} onClick={(e) => handleLinkStatus(e)}></Button>
                     <Button type='button' size="lg"   colorScheme='gray.200' variant="ghost" rightIcon={<AiOutlineFolderAdd />} onClick={() => handleFolderStatus()}></Button>
                </Box>
                </Center>
                
            </div>
        )
    }

    function FolderForm() {
        return (
        
        
            
            <Box left={3} right={2} pos="fixed" m={[10, 100]} bgColor="white" boxShadow="2xl" rounded='md' p='7' padding="20px" borderRadius='3xl' textAlign="center" zIndex={10}>
            <Formik
            initialValues={{ name: '', link:'' }}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                setFolderStatus(false)
                console.log("Folder Details are submitted")
                actions.setSubmitting(false)
                }, 1000)
            }}
            >{(props) => (
                <Form>
                    <Field name='name' validate={validateName}>
                        {({field, form}) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                                <FormLabel>Name of Folder</FormLabel>
                                <Input marginBottom="5px" {...field} placeholder='Name' />
                                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                    <Button 
                        mt={4}
                        colorScheme='teal'
                        isLoading={props.isSubmitting}
                        type='submit'>Create Folder</Button>
                </Form>
            )}


            </Formik>
            </Box>
            
            
        
        
    )

    }

    function LinkForm () {
            return (
        
        
            
            <Box  zIndex={10} left={3} right={2} pos="fixed" m={[10, 100]} boxShadow="2xl" rounded='md' bgColor="white" p='7' padding="20px" borderRadius='3xl' textAlign="center">
            <Formik
            initialValues={{ name: '', link:'' }}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                setLinkStatus(false)
                console.log("Link Details are submitted")
                actions.setSubmitting(false)
                }, 1000)
            }}
            >{(props) => (
                <Box>
                <Form>
                    <Field name='name' validate={validateName}>
                        {({field, form}) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                                <FormLabel>Name of Link</FormLabel>
                                <Input marginBottom="5px" {...field} placeholder='Name of Link' />
                                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                    <Field name='link' validate={validateLink}>
                        {({field, form}) => (
                            <FormControl isInvalid={form.errors.link && form.touched.link}>
                                <FormLabel>Link</FormLabel>
                                <Input {...field} placeholder='Link' />
                                <FormErrorMessage>{form.errors.link}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                    <Button 
                        mt={4}
                        colorScheme='teal'
                        isLoading={props.isSubmitting}
                        type='submit'>Create Bookmark</Button>
                </Form>
                </Box>
            )}


            </Formik>
            </Box>
            
            
        
        
    )


    }

    async function loadData() {
        var data_lst = []
        await supabase.from('data').select().then(
            result => {
                console.log("result from fetching data promise", result.data)

                data_lst = result.data
                setData(data_lst)
                console.log("Data lst", data)
                return data_lst
                

            }
        )
        
    
        

    }


    useEffect(() => {

        if (buttonSubmission === true) {
            const result = signInFunction()
            console.log("Username adding to Supabase :", username)
            setbuttonSubmission(false)
            console.log("Authentication Status after Promise", authStatus)
        }

        const relative_result = loadData()
        console.log("")
        
        
        




    }, [buttonSubmission])

    return (
        <div>
            {authStatus?<SuccessSignIn username={username} />:<HomePage />}    
            
        </div>
        

    )
}