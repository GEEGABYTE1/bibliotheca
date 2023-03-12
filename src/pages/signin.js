
import {Box, Flex, Button, Text, Center, FormControl, Input, FormLabel, FormErrorMessage, FormHelperText,} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
    const router = useRouter()

    const [buttonSubmission, setbuttonSubmission] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [authStatus, setStatus] = useState(false)
    const [addLinkStats, setLinkStatus] = useState(false)
    const [addFolderStatus, setFolderStatus] = useState(false)
    
    const [folderArray, updateFolderArray] = useState(folders)
    const [data, setData] = useState([])
    const [initialLinkDict, setInitialLinkDict] = useState({})
    const [linkDisplayArray, setLinkDisplayArray] = useState([])
    
    const handleTitleClick = (e, href) => {
        e.preventDefault()
        document.location.href = 'https://' + href

    }

    function conversionOfData() {
        const counter = Object.keys(initialLinkDict).length
        var id_count = 1
        var current_array = []
        if (counter > 0) {
            
            for (let i=0; i <= counter; i++) {
                const current_nameLink = Object.keys(initialLinkDict)[i]
                if (current_nameLink === undefined) {
                    continue
                } else {
                    const current_link = initialLinkDict[current_nameLink]
                    const id_string = (id_count).toString()
                    const idp_dictionary = {'id': id_string, 'name':current_nameLink, 'link': current_link}
                    current_array.push(idp_dictionary)

                }
                id_count += 1
                


            }
        }
        console.log("Newly Formatted Array for Display", current_array)
        setLinkDisplayArray(current_array)

    }

    function colouriterator(index) {
        if (index > colour_set.length) {
            index = 0 
        } 

        return index

    }


    function handleOnDragEnd(result) { 
        if (!result.destination) return;
        console.log(result)
        const items = Array.from(linkDisplayArray)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setLinkDisplayArray(items);
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
                                
                                {linkDisplayArray.map((object, index) => {
                                    {console.log(object.id)}
                                    return (
                                        <div>
                                            <Draggable key={object.id} draggableId={object.id} index={index}>
                                            {(provided) => (
                                 
                                                <Box type="button" zIndex={1} key={object.id} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} border="solid" borderRadius="20px" bgColor={colour_set[colouriterator(index)]} padding="8px" marginBottom="20px" h="auto" w="500px">
                                                    <h3><a href={object.link} onClick={(e) => handleTitleClick(e, object.link)}><Text fontSize="lg">{object.name}</Text></a></h3>
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
            initialValues={{ name: ''}}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                setFolderStatus(false)
                // DB Update
                const userData = fetchCurrentUserData()
                console.log("Updated User Dictionary ", userData)
                const current_folder_json = userData['folders']
                console.log("Current JSON format for folders", current_folder_json)
                const current_user_id = userData['id']
                const folder_name = `${values['name']}`
                var folder_dict = {};
                if (current_folder_json === null || current_folder_json === undefined || current_folder_json.length === 0) {
                    folder_dict[folder_name] = JSON.stringify({})
                    const initial_array = [JSON.stringify(folder_dict)]
                    updateFolderJson(current_user_id, initial_array, userData)




                } else {
                    // Change Logic here, the returned data type is an array
                    var checker = false
                    for (let i =0; i <= current_folder_json.length; i++) {
                        const current_json = current_folder_json[i]
                        console.log(`Array Json at ${i}: ${current_json}`)
                        if (current_json === undefined) {
                            continue
                        } else {
                            var converted_json = JSON.parse(current_json)
                            var converted_json_name = Object.keys(converted_json)[0]
                            if (converted_json_name === folder_name) {
        
                                checker = true
                        
                            } 

                        }
                        


                }
                if (checker === true) {
                    console.log("Error - Folder has already been made")

                } else {
                    const temp_dict = {}
                    temp_dict[folder_name] = JSON.stringify({})
                    var folder_dict_json = JSON.stringify(temp_dict)
                    current_folder_json.push(folder_dict_json)
                    console.log("Updating Folder JSON")
                    updateFolderJson(current_user_id, current_folder_json, userData)
                    
                }
                
                console.log("Folder Details are submitted")
                actions.setSubmitting(false)
                
                }}, 1000)
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

    function fetchCurrentUserData() {
        for (let i =0; i < data.length; i++) {
            const user_dict = data[i]
            const relative_username = user_dict['username']
            console.log("User Dictionary", user_dict)
            
            if (relative_username === username) {
                console.log("hold true")
                return user_dict
            } else{
                continue
            }
            
        }

        return {}
    }

    async function updateLinkJson(current_user_id, json_dict, userData) {
        const {error} = await supabase.from('data').update({id:current_user_id, username:userData['username'], folders:userData['folders'], links:json_dict}).eq('id', current_user_id)
        console.log("Possible Error from Supabase", error)
    }

    async function updateFolderJson(current_user_id, json_array, userData) {
        const {error} = await supabase.from('data').update({id:current_user_id, username:userData['username'], links:userData['links'], folders:json_array}).eq('id', current_user_id)
        console.log("Possible error from Supabase", error)
    }

    function LinkForm () {
            return (
        
        
            
            <Box  zIndex={10} left={3} right={2} pos="fixed" m={[10, 100]} boxShadow="2xl" rounded='md' bgColor="white" p='7' padding="20px" borderRadius='3xl' textAlign="center">
            <Formik
            initialValues={{ name: '', link:'' }}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                

                // Link DB Update
                const userData = fetchCurrentUserData()
                console.log("Updated User Dictionary ", userData)
                const current_link_json = userData['links']
                console.log("Current JSON format for links", current_link_json)
                const current_user_id = userData['id']
                const link_name = `${values['name']}`
                const link_string = values['link']


                var link_dict;
                if (current_link_json === null || current_link_json === undefined) {
                    link_dict = {link_name: link_string}
                } else {
                    link_dict = JSON.parse(current_link_json)
                    link_dict[`${link_name}`] = link_string
                }

            

                const json_converted_dict = JSON.stringify(link_dict)
                console.log("Converted JSON dictionary with updated link", json_converted_dict)
                updateLinkJson(current_user_id, json_converted_dict, userData)
                


                console.log("Link Details are submitted")
                actions.setSubmitting(false)
                }, 1000)
                setLinkStatus(false)
                
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
        console.log("Data lst from UseEffect", data)
        if (data.length > 0) {
            const rel_user = fetchCurrentUserData()
            console.log("initial rel_user",  rel_user)
            const json_link = rel_user['links']
            const json_link_dict = JSON.parse(json_link)
            setInitialLinkDict(json_link_dict)
            conversionOfData()

        }
        

        
        
        




    }, [buttonSubmission])

    return (
        <div>
            {authStatus?<SuccessSignIn username={username} />:<HomePage />}    
            
        </div>
        

    )
}