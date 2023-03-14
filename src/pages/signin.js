
import {Box, Flex, Spacer, Button, Text, Center, FormControl, Input, FormLabel, FormErrorMessage, FormHelperText, color,} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {createClient} from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import {BsLink} from 'react-icons/bs'
import {AiOutlineFolderAdd, AiFillDelete} from 'react-icons/ai'
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
    const [displayFolder, setDisplayFolder] = useState(false)
    const [folderIndex, setFolderIndex] = useState()
    const [folderName, setFolderName] = useState()
    const [folder, setFolder] = useState([])
    
    
    const [folderArray, updateFolderArray] = useState(folders)
    const [data, setData] = useState([])
    const [initialLinkDict, setInitialLinkDict] = useState({})
    const [initialArrayFolder, setInitialFolderArray] = useState([])

    const [linkDisplayArray, setLinkDisplayArray] = useState([])
    const [folderDisplayArray, setFolderDisplayArray] = useState([])



    // *****************************************************

    // Deleting Data Section
    function deleteLink(index) {
        console.log(`Array at Index: ${index} - ${linkDisplayArray[index]} is deleting`)
        var updated_link_dict = {}
        for (let i=0; i <= linkDisplayArray.length;i++) {
            var current_obj_link = linkDisplayArray[i]
            console.log("Current Object Link: ", current_obj_link)
            if (current_obj_link === undefined) {
                continue
            }
            if (i === index) {
                continue
            } else {
                var rel_key_name = current_obj_link['name']
                const rel_key_link = current_obj_link['link']

                
                updated_link_dict[rel_key_name] = rel_key_link
            }
        }
        const userData = fetchCurrentUserData()
        const current_user_id = userData['id']

        const updated_link_json = JSON.stringify(updated_link_dict)
        updateLinkJson(current_user_id, updated_link_json, userData)
        console.log("Deleting process complete")


    }

    function deleteFolder(name) {
        console.log(`Folder Index to Delete: ${name}`)
        const new_array_folders = []
        
        const userData = fetchCurrentUserData()
        const current_user_id = userData['id']
        const current_folder_array = userData['folders']
        for (let i=0; i <= current_folder_array.length; i++) {
            const current_json_string = current_folder_array[i]
            if (current_json_string === undefined) {
                continue
            }
            var current_dict = JSON.parse(current_json_string)
            console.log("Current Prospecting Dictionary: ", current_dict)
            const current_dict_key = Object.keys(current_dict)[0]
            if (current_dict_key === name) {
                continue
            } else {
                current_dict = JSON.stringify(current_dict)
                new_array_folders.push(current_dict)
            }
        }
        console.log("New Array of Folders: ", new_array_folders)
        updateFolderJson(current_user_id, new_array_folders, userData)
        console.log("Deleting Folder Process Complete")
        setDisplayFolder(false)

    }

    function deleteLinkWithinFolder(index, fileName) {
        console.log(`Deleting Link at Index: ${index}`)
        const new_array = {}
        for (let i =0; i <= folder.length; i++) {
            const current_dict = folder[i]
            if (current_dict === undefined || current_dict === null) {
                continue
            } else {
                if (i === index) {
                    continue
                } else {
                    const current_key = Object.keys(current_dict)[0]
                    const current_val = current_dict[current_key]
                    new_array[current_key] = current_val
                }

            }
            
        }
        

        
        const userData = fetchCurrentUserData()
        const userFolders = userData['folders']
        const current_user_id = userData['id']
        var folder_to_change = undefined
        // need to fix iteration
        console.log("Current JSON format for userFolders: ", userFolders)
        
        for (let i=0; i <= userFolders.length; i++) {
            const current_json_string = userFolders[i]
            if (current_json_string === undefined) {
                continue
            } else {
                var rel_dict = JSON.parse(current_json_string)
                console.log("Relative Dictionary: ", rel_dict)
                var rel_key = Object.keys(rel_dict)[0]
                console.log("Relative Key for Parent Dictionary: ", rel_key)
                var nested_link_dictionary = rel_dict[rel_key]
                console.log("Nested Link Dictionary: ", nested_link_dictionary)
                var nested_link_dictionary_keys = Object.keys(nested_link_dictionary)

                console.log("Filename to Compare: ", fileName)
                for (let link_index=0;link_index <= nested_link_dictionary_keys.length; link_index++) {
                   var current_key = nested_link_dictionary_keys[link_index]
                   if (current_key === fileName) {
                        console.log(`Key ${rel_key} needs to be altered as both keys match`)
                        folder_to_change = rel_key
                        if (Object.keys(new_array).length === 0) {
                            rel_dict[rel_key] = JSON.stringify(new_array)
                        } else {
                            rel_dict[rel_key] = new_array
                        }
                        
                        
                        rel_dict = JSON.stringify(rel_dict)
                        userFolders[i] = rel_dict
                        updateFolderJson(current_user_id, userFolders, userData)
                        console.log("Updated userFolders", userFolders)
                        break
                   } else {
                    continue
                   }
                }

                
                console.log("Deleting Link within Folder Process Complete")
                

                

            }
        }


    }

    // *****************************************************
    const handleTitleClick = (e, href) => {
        e.preventDefault()
        document.location.href = 'https://' + href

    }

    function FolderDisplay(props) {

        return (
        
            <Box  zIndex={10} left={3} right={2} pos="fixed" m={[10, 100]} boxShadow="2xl" rounded='md' bgColor="white" p='7' padding="20px" borderRadius='3xl' textAlign="center">
            <Button onClick={() => setDisplayFolder(false)} padding="4px" bgColor="transparent" pos="absolute" top={0} left={0}>X</Button>
            
            <Text padding="2px" fontWeight='bold' fontSize="25px">{props.folderName}</Text>
            <Button pos="absolute" top={0} right={0} colorScheme='gray.200' variant="ghost" rightIcon={<AiFillDelete />} onClick={() => deleteFolder(props.folderName)}></Button>
            <Flex>
            
            <Formik
            initialValues={{ name: '', link:'' }}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                

                // Link DB Update
                const userData = fetchCurrentUserData()
                console.log("Updated User Dictionary ", userData)
                var current_folder_json = userData['folders']
                var user_id = userData['id']
                console.log("Current JSON format for folders: ", current_folder_json)
                
                const link_name = `${values['name']}`
                const link_string = values['link']
                for (let i=0; i <= current_folder_json.length; i++) {
                    const json_string = current_folder_json[i]
                    if (json_string === undefined) {
                        continue
                    }
                    var rel_dict = JSON.parse(json_string)
                    const rel_dict_key = Object.keys(rel_dict)[0]
                    if (rel_dict_key === props.folderName) {
                        if (rel_dict[rel_dict_key] === '{}') {
                            var current_nested_dictionary = JSON.parse(rel_dict[rel_dict_key])
                        } else {
                            var current_nested_dictionary = rel_dict[rel_dict_key]
                        }
                        
                        console.log("Current Nested Dictionary: ", current_nested_dictionary)
                        current_nested_dictionary[link_name] = link_string
                        rel_dict[rel_dict_key] = current_nested_dictionary
                        console.log("Converted Nested Dictionary: ", rel_dict)
                        var updated_dict = JSON.stringify(rel_dict)
                        current_folder_json[i] = updated_dict
                        console.log("Updated Folder JSON Array: ", current_folder_json)

                        
                        updateFolderJson(user_id, current_folder_json, userData)
                    } else {
                        continue
                    }
                }



                console.log("Link Details are submitted")
                actions.setSubmitting(false)
                }, 1000)
                setLinkStatus(false)
                
            }}
            >{(props) => (
                <Box marginLeft='100px' w="1000px">
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
            <Spacer />
            {folder.length > 0?<Box marginLeft= "80px" marginRight="100px" padding="20px" w="auto" h="auto" overflow-y="scroll">
                <h1>Links</h1>
                <DragDropContext onDragEnd={handleOnDragEndFolderLink}>
                    <Droppable droppableId="folders">
                        {(provided) => (
                            
                            <div className="folders" {...provided.droppableProps} ref={provided.innerRef}>
                                
                                {folder.map((object, index) => {
                                    {console.log(Object.keys(object)[0])}
                                    
                                    return (
                                        
                                            <Draggable key={Object.keys(object)[0]} draggableId={Object.keys(object)[0]} index={index}>
                                            {(provided) => (
                                                
                                                <Flex type="button" zIndex={1} key={Object.keys(object)[0]} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} border="solid" borderRadius="20px" bgColor={colour_set[colouriterator(index)]} padding="8px" marginBottom="20px" h="auto" w="500px" >
                                                    <button onClick={(e) => openFolder(e, index, Object.keys(object)[0])}><h3>{Object.keys(object)[0]}</h3></button>
                                                    <Spacer />
                                                    <Button whiteSpace="normal" colorScheme='gray.200' variant="ghost" rightIcon={<AiFillDelete />} onClick={() => deleteLinkWithinFolder(index, Object.keys(object)[0])}></Button>
                                                </Flex>
                                            )}
                                        </Draggable>
                                            
                                        
                                        
                                       
                                    )
                                })}
                                {provided.placeholder}

                            </div>
                            
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>: 
            
            <Box marginRight="200px" padding="20px" w="auto" h="auto" >
                <Text> This folder is Empty :(</Text>
            </Box>
            }
            
            
            
            </Flex>
            </Box>
            
            
            
        
        
    )

    }

    function openFolder(e, index, folderName) {
        e.preventDefault()
        console.log("Index of Folder Open: ", index)
        setFolderIndex(index)
        setFolderName(folderName)
        setDisplayFolder(true)

        // fetching current folder 
        const initialUserData = fetchCurrentUserData()
        var array = []
        const folders_array = initialUserData['folders']
        for (let i=0; i <= folders_array.length; i++) {
            var current_folder = folders_array[i]
            if (current_folder === undefined) {
                continue
            }
            var current_dict = JSON.parse(current_folder)
            var current_key = Object.keys(current_dict)[0]
            if (current_key === folderName) {
                var nested_dict = current_dict[current_key]
                if (nested_dict === '{}') {
                    var current_nested_dictionary = JSON.parse(nested_dict)
                    console.log("Current Nested Dictionary that will be Set to UseState: ", current_nested_dictionary)
                    setFolder([])
                } else {
                    var current_nested_dictionary = nested_dict
                    console.log("Current Nested Dictionary that will be Set to UseState: ", current_nested_dictionary)
                    var keys = Object.keys(current_nested_dictionary)
                    for (let key_index=0; key_index <= keys.length; key_index++) {
                        var relative_value = current_nested_dictionary[keys[key_index]]
                        if (relative_value === undefined) {
                            continue
                        }
                        console.log(`Relative value for Key: ${keys[key_index]} --> ${relative_value}`)
                        var d = {}
                        d[keys[key_index]] = relative_value
                        array.push(d)

                    }
                    setFolder(array)
                    console.log("Array that has been set for UseState: ", array)

                }
            }
        }

    }

    function conversionOfFolderData() {
        var folder_array_dict = []
        const userDataFolder = fetchCurrentUserData()
        console.log("Updated User Dictionary ", userDataFolder)
        const folder_array_db = userDataFolder['folders']
        if (folder_array_db === undefined || folder_array_db === null) {
            setFolderDisplayArray([])
        } else {
            for (let i=0; i <= folder_array_db.length; i++) {
                var current_folder_json_string = folder_array_db[i]
                if (current_folder_json_string === undefined) {
                    continue
                } else {
                    var converted_json_string_dict = JSON.parse(current_folder_json_string)
                    console.log("Converted JSON string dict from Supabase: ", converted_json_string_dict)
                    folder_array_dict.push(converted_json_string_dict)
    
                }
    
    
            }

        }
        

        console.log("Formatted Array for Folder Display: ", folder_array_dict)
        setFolderDisplayArray(folder_array_dict)
        
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
        console.log("Setting Index")
        
        if (index >= colour_set.length) {
            var index = 0 
            
            
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
        const folder_items = Array.from(folderDisplayArray)
        const [reorderedItem] = folder_items.splice(result.source.index, 1)
        folder_items.splice(result.destination.index, 0, reorderedItem)
        setFolderDisplayArray(folder_items)
    }

    function handleOnDragEndFolderLink(result) {
        if (!result.destination) return;
        console.log("folder in File result: ", result)
        const updated_folder = Array.from(folder)
        const [reorderedItem] = updated_folder.splice(result.source.index, 1)
        updated_folder.splice(result.destination.index, 0, reorderedItem)
        setFolder(updated_folder)

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
                {displayFolder?<FolderDisplay index={folderIndex} folderName={folderName}/>:console.log("Folder display is dismissed")}
                <Text padding="2px" fontWeight='bold' fontSize="30px" top={0} left={0}>Welcome {props.username}!</Text>
                // View for bookmarks and Folders

                
                <Center>
                <Box zIndex={1} textAlign="center"  display="flex" padding="100px" h="auto" w="auto" flexDirection="row">
                <Box zIndex={1} boxShadow="2xl" borderRadius="20px" padding="10px" h="400px" overflow="scroll">
                <Text marginBottom='20px' fontWeight='bold' fontSize='20px'> Folders </Text>
                <DragDropContext onDragEnd={handleOnDragEndFolder}>
                    <Droppable droppableId="folders">
                        {(provided) => (
                            
                            <div className="folders" {...provided.droppableProps} ref={provided.innerRef}>
                                
                                {folderDisplayArray.map((object, index) => {
                                    {console.log(Object.keys(object)[0])}
                                    
                                    return (
                                        
                                            <Draggable key={Object.keys(object)[0]} draggableId={Object.keys(object)[0]} index={index}>
                                            {(provided) => (
                                                
                                                
                                                <Box type="button" zIndex={1} key={object.id} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} border="solid" borderRadius="20px" bgColor={colour_set[colouriterator(index)]} padding="8px" marginBottom="20px" h="auto" w="500px" >
                                                    
                                                    <button onClick={(e) => openFolder(e, index, Object.keys(object)[0])}><h3>{Object.keys(object)[0]}</h3></button>
                                                    
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
                                                    <Button type='button' size="lg"   colorScheme='gray.200' variant="ghost" rightIcon={<AiOutlineFolderAdd />} onClick={() => console.log()}></Button>
                                                    <Button type='button' size="lg"   colorScheme='gray.200' variant="ghost" rightIcon={<AiFillDelete />} onClick={() => deleteLink(index)}></Button>
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
                <Box zIndex={4} pos="fixed" bottom="7" bgColor="tomato" borderColor='tomato' color="white" display="flex" columnGap="50%" alignItems="center" justifyContent="center" padding="5px"  borderRadius='lg'  w='30%'>
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
        const updating_data = loadData()
        console.log("*Updating Data under fetchCurrentUserData() function*")
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

    function folderArrayFormulation(array_json) {
        
        var new_array = []
        console.log("initial array json: ", array_json)
        if (array_json === null) {
            return new_array
        } else {
            for (let i=0; i <= array_json.length; i++) {
                const current_json_string = array_json[i]
                console.log("Array JSon", current_json_string)
                if (current_json_string === undefined) {
                    continue
                } else {
                    const converted_current_json_string = JSON.parse(current_json_string)
                    
                    new_array.push(converted_current_json_string)
                }
             
            }

        }
        
        return new_array
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
            const json_folder = rel_user['folders']
            console.log("Json Folder JSON: ", json_folder)
            const initial_folder_array = folderArrayFormulation(json_folder)
            console.log("Initial Folder Array: ", initial_folder_array)



            conversionOfData()
            conversionOfFolderData()

        }
        

        
        
        




    }, [buttonSubmission])

    return (
        <div>
            {authStatus?<SuccessSignIn username={username} />:<HomePage />}    
            
        </div>
        

    )
}