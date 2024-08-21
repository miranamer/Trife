import {React, useState, useRef, useEffect} from 'react'
import { TreeNode } from "react-organizational-chart";
import { FaCheckCircle, FaPencilAlt } from "react-icons/fa";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Select,
    Input,
    AlertDialog,
    Alert,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogFooter,
    AlertIcon,
    Tag,
    TagLabel,
    TagCloseButton,
    Textarea
  } from '@chakra-ui/react'

  import ImageGallery from "react-image-gallery";
  import "react-image-gallery/styles/css/image-gallery.css";
  import { FileUploader } from "react-drag-drop-files";
  import emojiRegex from 'emoji-regex';
  import type { node, page } from '../App';
import { supabaseClient } from '../config/supabase-client';
import { Session } from '@supabase/supabase-js';
import {v4 as uuidv4} from 'uuid';
import { MdDeleteForever } from "react-icons/md";

//store
import { usePageStore } from '../store/page-store';


type NodeProps = {
    node: node;
    showTree: boolean;
    tags: string[][];
    setTags: React.Dispatch<React.SetStateAction<string[][]>>;
    moods: string[];
    setMoods: React.Dispatch<React.SetStateAction<string[]>>;
};

enum NodeStyle{
    choiceNode = "StyledNodeChoice",
    goodNode = "StyledNodeResultGood",
    mediumNode = "StyledNodeResultMedium",
    badNode = "StyledNodeResultBad",
    retrospectNode = "StyledNodeRetrospect"
}

const MoodStyle = {[NodeStyle.choiceNode]: "moodChoice", [NodeStyle.goodNode]: "moodGood", [NodeStyle.mediumNode]: "moodMedium", [NodeStyle.badNode]: "moodBad", [NodeStyle.retrospectNode]: "moodRetrospect"}

const Node = ({node, showTree, tags, setTags, moods, setMoods} : NodeProps) => {

    const { isOpen, onOpen, onClose } = useDisclosure() // Manage Node Modal
    const { isOpen: isOpenMood, onOpen: onOpenMood, onClose: onCloseMood } = useDisclosure() // Mood Modal
    const { isOpen: isOpenManage, onOpen: onOpenManage, onClose: onCloseManage } = useDisclosure() // Details Page Modal
    
    const [selectedNodeType, setSelectedNodeType] = useState<string>(""); // Selected node from node type dropdown
    const [nodeText, setNodeText] = useState<string>(""); // Text for the node
    const [tagMaker, setTagMaker] = useState<boolean>(false); // Section to make new tags
    const [tagColor, setTagColor] = useState<string>(""); // Color for the new tag
    const [tagText, setTagText] = useState<string>(""); // Text for the new tag
    const [selectedTags, setSelectedTags] = useState<string[][]>([]); // Selected tags to add to the node
    const [mood, setMood] = useState<string>(node["mood"]); // Mood for the node
    const [openFileUploader, setOpenFileUploader] = useState<boolean>(false); // File uploader for media
    const [detailsText, setDetailsText] = useState<string>(node["details"]); // Details text for the node
    const [detailsTextForm, setDetailsTextForm] = useState<boolean>(node["details"] === "" ? false : true); // Determines if the details text is shown or if text box is shown
    const [newNodeValue, setNewNodeValue] = useState<string>(""); // New value for the node
    const [file, setFile] = useState(null);

    const [session, setSession] = useState<Session | null>();

    const {pagePtr, pages, setPagePtr, setPages} = usePageStore((state) => (
        {
        pagePtr: state.pagePtr,
        pages: state.pages,
        setPagePtr: state.setPagePtr,
        setPages: state.setPages
        }
      ));

    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
          })
      
          supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session);
          })
    }, [])

    const fileTypes = ["JPG", "PNG", "GIF"]; // File types for the file uploader
    
    //! Node Functions

    //? Function to delete an image from the node's image gallery
    const handleDeleteImage = async (id) => {
        const imageURL = node.media.find((image) => image.id === id).original;
        const fullFilePath = imageURL.split('node-media/')[1];

        const updatedMedia = node.media.filter((image) => image.id !== id);
        node["media"] = updatedMedia;
        
        const updatedPages = [...pages];
        setPages(updatedPages);

        try {
            // Delete the image from Supabase storage
            const { error } = await supabaseClient.storage
              .from('node-media')
              .remove([fullFilePath]);
        
            if (error) throw error;
        
            alert('Image deleted successfully!');
          } catch (error) {
            alert('Error deleting image: ' + error.message);
          }

        
        const updatedPage = updatedPages.find((page) => page.id === pagePtr);

        console.log(updatedPage);

        
        const { data, error: pageError } = await supabaseClient
        .from('Pages')
        .update({ node: updatedPage.node })
        .eq('id', pagePtr);

        if (pageError) {
            console.error('Error updating page details:', pageError);
            return;
        }
    }

    //? Function to render the images in the image gallery with a delete button
    const renderImageWithDeleteButton = (item) => {
        return (
          <div style={{ position: 'relative' }}>
            <img src={item.original} alt="" style={{ width: '100%' }} />
            <MdDeleteForever
              onClick={() => handleDeleteImage(item.id)}
              className='absolute top-2 right-2 text-red-500 hover:cursor-pointer text-4xl'
            >
              X
            </MdDeleteForever>
          </div>
        );
    };

    //? Function to handle file upload
    const handleFileUpload = async (file) => {
        setFile(file);

        const fileName = `${session?.user.id}/${uuidv4()}`

        const {data, error} = await supabaseClient
        .storage
        .from('node-media')
        .upload(fileName, file);

        if (error) throw error;

        const { data: fetchedImage } = supabaseClient.storage
        .from('node-media') // Replace 'images' with your bucket name
        .getPublicUrl(fileName); // filePath is the path used in the upload

        console.log(fetchedImage)

        
        const supabaseImageURL = fetchedImage.publicUrl;

    
        const mediaItem = {
            original: supabaseImageURL,
            thumbnail: supabaseImageURL,
            id: node.media.length
        };
    
        // Add the media item to the node
        node["media"].push(mediaItem);
    
        // Update the pages state
        const updatedPages = [...pages];
        setPages(updatedPages);
    
        // Get the current page based on pagePtr
        const updatedPage = updatedPages.find(page => page.id == pagePtr);
        console.log(updatedPage)
    
        if (updatedPage) {
            // Update the page in Supabase
            const { data, error } = await supabaseClient
                .from('Pages')
                .update({ node: updatedPage.node }) // Update the node structure in the database
                .eq('id', updatedPage.id); // Ensure you're updating the correct page by its ID
    
            if (error) {
                console.error('Error updating page after adding image:', error);
                return;
            }
    
            console.log('Page updated successfully with new image:', data);
        } else {
            console.error('Page not found for the provided pagePtr');
        }
    };

    //? Function to handle the node type dropdown
    const handleSelectChange = (e) => setSelectedNodeType(e.target.value); // Changes value of choice based on option clicked on dropdown

    //? Function to add a new node
    const addNode = async (pageId: number) => {
        if (selectedNodeType == "") {
          alert('Select a valid option');
          return;
        }
      
        const nodeToAdd: node = {
          value: nodeText,
          children: [],
          nodeStyle: selectedNodeType,
          moodStyle: MoodStyle[selectedNodeType],
          mood: "",
          tags: selectedTags,
          details: "",
          isRoot: false,
          media: [
            {
              original: "https://picsum.photos/id/1018/1000/600/",
              thumbnail: "https://picsum.photos/id/1018/250/150/",
            },
          ],
        };
    
        
        node["children"].push(nodeToAdd);
        let updatedPages = [...pages];
        setPages(updatedPages);
      
        // Update the page in Supabase
        const { data, error } = await supabaseClient
          .from('Pages')
          .update({ node: updatedPages.find(page => page.id === pageId)?.node }) // Update the node structure in the page
          .eq('id', pageId); // Ensure you're updating the correct page by its ID
      
        if (error) {
          console.error('Error updating page:', error);
          return;
        }
      
        console.log('Page updated successfully:', data);
    };

    //? Function to delete a node
    const deleteNodeNew = async (rootNode: node) => {
    
        for(let i = 0; i < rootNode.children.length; i++){
            if(rootNode.children[i] == node){
                rootNode.children = rootNode.children.filter((child) => child !== node);
                const updatedPages = [...pages];
                setPages(updatedPages);

                const { data, error } = await supabaseClient
                .from('Pages')
                .update({ node: updatedPages.find(page => page.id == pagePtr)?.node }) // Update the node structure in the database
                .eq('id', pagePtr); // Ensure you're updating the correct page by its ID
    
                if (error) {
                    console.error('Error updating page after node deletion:', error);
                    return;
                }
        
                console.log('Page updated successfully with node deletion:', data);

                return;
            }
            else{
                deleteNodeNew(rootNode.children[i]);
            }
        }
    };

    //? Function to handle the right click on the emoji mood bar
    function handleMoodMenu(event) {
        //^ right click on emoji mood bar
        event.preventDefault(); // Prevent the default context menu from appearing
        event.stopPropagation(); // Prevents event bubbling up to the parent element and activating default context menu
        setMood(node["mood"]);
        onOpenMood();
    }

    //? Function to handle the right click on the node
    function handleManageNodeMenu(event) {
        //^ right click on Node to get manage node menu
        event.preventDefault(); // Prevent the default context menu from appearing
        onOpen();
    }

    //? Function to make a new tag and add it to supabase db
    const addNewTag = async () => {
        setTags([...tags, [tagText, tagColor]])
        
        const { data, error } = await supabaseClient
        .from('Tags')
        .insert([
            {
                userID: session?.user.id,
                tagText: tagText,
                tagColor: tagColor,
            }
        ]);

    if (error) {
        console.error('Error adding new tag:', error);
    } else {
        console.log('Tag added successfully:', data);
    }
    }

    //? Function to select a tag to be added to node
    const selectTag = (tag) => {
        if(selectedTags.includes(tag) == false){
            setSelectedTags([...selectedTags, tag])
        }
        else{
            setSelectedTags(selectedTags.filter(curr => curr != tag));
        }
    }

    //? Function to close the manage node modal
    const closeModal = () => {
        setNodeText("")
        setTagColor("")
        setTagText("")
        setTagMaker(false);
        setSelectedTags([]);
        onClose()
    }

    //? Function to change nodes mood and update the database with new moods
    const handleMoodChange = async () => {
        node["mood"] = mood;
    
        if (mood === "🪄🪄🪄") {
            alert("You're a wizard Harry");
        }
    
        // Extract emoji sequences from the mood string
        const emojiArray = Array.from(mood.match(emojiRegex()) || []);
        
        // Create a Set to store unique moods
        const uniqueMoodsSet = new Set([...moods, ...emojiArray]);
        const uniqueMoodsArray = Array.from(uniqueMoodsSet).filter(char => char !== "");
    
        // Update local state
        setMoods(uniqueMoodsArray);
        let updatedPages = [...pages]
        setPages(updatedPages);


        const { dataPage, errorPage } = await supabaseClient
            .from('Pages')
            .update(updatedPages.find(page => page.id == pagePtr)) // Update the page so it has the new mood on its node
            .eq('id', pagePtr); // Ensure you're updating the correct page by its ID
      
          if (errorPage) {
            console.error('Error updating page details:', errorPage);
            return;
          }

    
        // Fetch existing moods for the user from Supabase
        const { data: existingMoods, error } = await supabaseClient
            .from('Moods')
            .select('mood')
            .eq('userID', session?.user.id);
    
        if (error) {
            console.error('Error fetching existing moods:', error);
            return;
        }
    
        // Extract existing moods into a Set
        const existingMoodsSet = new Set(existingMoods.map((entry) => entry.mood));
    
        // Find moods that are not stored in supabase table
        const newMoods = uniqueMoodsArray.filter((mood) => !existingMoodsSet.has(mood));
    
        if (newMoods.length > 0) {
            // Insert new moods into Supabase
            const { error: insertError } = await supabaseClient
                .from('Moods')
                .insert(newMoods.map((mood) => ({
                    mood: mood,
                    userID: session?.user.id,
                })));
    
            if (insertError) {
                console.error('Error inserting new moods:', insertError);
            } else {
                console.log('New moods added successfully');
            }
        }
    };

    //? Function to handle the details text change
    const handleDetailTextChange = async (pageId: number) => {
        // Update the node's details
        node["details"] = detailsText;
      
        // Update local state
        setDetailsTextForm(true); // show the detail text now not the text box
        setPages([ ...pages ]);
      
        // Find the page to update
        const updatedPage = pages.find(page => page.id === pageId);
      
        if (updatedPage) {
          // Update the page in Supabase
          const { data, error } = await supabaseClient
            .from('Pages')
            .update({ node: updatedPage.node }) // Update the node structure in the database
            .eq('id', pageId); // Ensure you're updating the correct page by its ID
      
          if (error) {
            console.error('Error updating page details:', error);
            return;
          }
      
          console.log('Page details updated successfully:', data);
        } else {
          console.error('Page not found');
        }
    };

    //? Function to open the details text box
    const openDetailTextBox = () => {
        setDetailsText(node["details"]);
        setDetailsTextForm(false);
    };

    //? Function to open the details page
    const openDetailsPage = () => {
        onOpenManage();
        node["details"] === "" ? setDetailsTextForm(false) : setDetailsTextForm(true);
    };
    
    //? Function to close the details page
    const closeDetailsPage = () => {
        onCloseManage();
        setDetailsText("");
        setOpenFileUploader(false);
        setFile(null);
    };

    //? Function to update node text (value)
    const handleNodeTextChange = async (e, pageId: number) => {
        e.preventDefault();

        node["value"] = newNodeValue;

        const updatedPages = [...pages];
        
        setPages(updatedPages);

        const updatedPage = updatedPages.find(page => page.id === pageId);
      
        if (updatedPage) {
          // Update the page in Supabase
          const { data, error } = await supabaseClient
            .from('Pages')
            .update({ node: updatedPage.node }) // Update the node structure in the database
            .eq('id', pageId); // Ensure you're updating the correct page by its ID
      
          if (error) {
            console.error('Error updating page details:', error);
            return;
          }
      
          console.log('Page details updated successfully:', data);
        } else {
          console.error('Page not found');
        }
    };


    return (
        <>
            <TreeNode
            label={node["value"] !== "" ?
                <div
                className={`mt-[10px] ${node["nodeStyle"]} hover:cursor-pointer`}
                onContextMenu={handleManageNodeMenu}
                onClick={openDetailsPage}
                >
                <div className="flex flex-col items-center justify-center w-full h-full">
                    {node["tags"].length > 0 ? 
                    <Tag
                    size='sm'
                    borderRadius='full'
                    variant='solid'
                    colorScheme={node["tags"][0][1]}
                    className='absolute top-[-10px]'
                    >
                    <TagLabel>{node["tags"].length > 1 ? `${node["tags"][0][0]} + ${node["tags"].length - 1}...` : node["tags"][0][0]}</TagLabel>
                </Tag> : null}
                    {node["value"]}
                </div>
                    <div
                        onContextMenu={handleMoodMenu}
                        className={`somelement z-10 hover:cursor-pointer w-max p-3 h-[5%] ${node["moodStyle"]} rounded-2xl border-2 flex items-center justify-center gap-3 text-lg`}
                    >
                        <p>{node["mood"]}</p>
                    </div>
                </div>
            : null}
            >
            {node["children"].map((child) => showTree(child))}
            </TreeNode>

            <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Manage Node</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <div className="flex flex-col gap-5">
                    <Select placeholder='Select Option' variant='filled' onChange={(e) => handleSelectChange(e)}>
                        <option value={NodeStyle.choiceNode}>Add Choice</option>
                        <option value={NodeStyle.goodNode}>Add Good Result</option>
                        <option value={NodeStyle.mediumNode}>Add Mid Result</option>
                        <option value={NodeStyle.badNode}>Add Bad Result</option>
                        <option value={NodeStyle.retrospectNode}>Add Retrospect Node</option>
                        {node["isRoot"] !== true ? <option value={"DeleteNode"}>Delete Node</option> : null}
                    </Select>
                    {selectedNodeType != "DeleteNode" ? <div className='flex flex-col gap-5'><Input onChange={(e) => setNodeText(e.target.value)} placeholder='Node Text' />
                    <div className="flex bg-gray-700 p-5 rounded-md gap-2 flex-wrap">
                    {tags.map((tag) => (
                        <Tag
                        size='lg'
                        borderRadius='full'
                        variant='solid'
                        colorScheme={tag[1]}
                        className='hover:cursor-pointer'
                        onClick={() => selectTag(tag)}
                        >
                        <TagLabel>{tag[0]}</TagLabel>
                        {selectedTags.includes(tag) ? <TagCloseButton /> : null}
                    </Tag>
                    ))}
                    </div>
                    <Button variant='outline' onClick={() => setTagMaker(!tagMaker)}>Add New Tag</Button>
                    {tagMaker === true ? <div className="flex flex-col gap-5">
                        <div className="flex">
                        <Input onChange={(e) => setTagText(e.target.value)} variant="filled" placeholder='Tag Text' />
                        <div className="flex items-center justify-center w-full gap-2">
                            <div onClick={() => tagColor !== "blue" ? setTagColor("blue") : setTagColor("")} className={`w-[30px] h-[30px] bg-blue-500 hover:cursor-pointer ${tagColor === "blue" ? "border-2 border-black" : null} `}></div>
                            <div onClick={() => tagColor !== "red" ? setTagColor("red") : setTagColor("")} className={`w-[30px] h-[30px] bg-red-500 hover:cursor-pointer ${tagColor === "red" ? "border-2 border-black" : null}`}></div>
                            <div onClick={() => tagColor !== "green" ? setTagColor("green") : setTagColor("")} className={`w-[30px] h-[30px] bg-green-500 hover:cursor-pointer ${tagColor === "green" ? "border-2 border-black" : null}`}></div>
                            <div onClick={() => tagColor !== "yellow" ? setTagColor("yellow") : setTagColor("")} className={`w-[30px] h-[30px] bg-yellow-500 hover:cursor-pointer ${tagColor === "yellow" ? "border-2 border-black" : null}`}></div>
                            {tagText == "<secret>" ? <div onClick={() => tagColor !== "purple" ? setTagColor("purple") : setTagColor("")} className={`w-[30px] h-[30px] bg-purple-500 hover:cursor-pointer ${tagColor === "purple" ? "border-2 border-black" : null}`}></div> : null}
                        </div>
                        </div>
                        <div className="flex gap-10 items-center justify-center">
                            <Tag
                                size='lg'
                                borderRadius='full'
                                variant='solid'
                                colorScheme={tagColor === "" ? "gray" : tagColor}
                                >
                                <TagLabel>{tagText}</TagLabel>
                            </Tag>
                            <p onClick={() => addNewTag()} className='text-green-500 text-4xl hover:cursor-pointer'><FaCheckCircle /></p>
                        </div>
                    </div> : null}
                    <Button onClick={() => addNode(pagePtr)} colorScheme='green'>Create</Button></div> : <div className="flex items-center justify-center"><Button className='w-full' onClick={() => deleteNodeNew(pages.find(page => page.id === pagePtr)["node"])} colorScheme='red'>Delete</Button></div>}
                </div>
            </ModalBody>

            <ModalFooter>
            </ModalFooter>
            </ModalContent>
            </Modal>



            <Modal isOpen={isOpenMood} onClose={onCloseMood}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Mood</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="flex flex-col gap-5">
                            <Input value={mood} onChange={(e) => setMood(e.target.value)} placeholder='Enter Mood Emojis' />
                            <Button onClick={() => handleMoodChange()}>Done</Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/* Add the footer for your mood modal here */}
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenManage} onClose={closeDetailsPage}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Node Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="flex flex-col gap-5">
                            <p>Edit Node Value</p>
                            <form action="" onSubmit={(e) => handleNodeTextChange(e, pagePtr)}>
                                <Input value={newNodeValue} onChange={(e) => setNewNodeValue(e.target.value)} placeholder='Edit Node Text' />
                            </form>
                            <div className="h-[1px] w-full bg-gray-400"></div>
                            {detailsTextForm === false ? <Textarea value={detailsText} onChange={(e) => setDetailsText(e.target.value)} placeholder='Enter Event Details' /> : <div className='mb-10 flex flex-wrap relative w-[95%]'><h1 className='font-semibold text-gray-700'>{node["details"]}</h1><p onClick={() => openDetailTextBox()} className='absolute top-0 right-[-20px] text-blue-400 text-2xl hover:cursor-pointer hover:text-blue-700'><FaPencilAlt /></p></div>}
                            <div className="flex w-full flex-wrap gap-2">
                            {node["tags"].map((tag) => (
                                    <Tag
                                    size='lg'
                                    borderRadius='full'
                                    variant='solid'
                                    colorScheme={tag[1]}
                                    >
                                        <TagLabel>{tag[0]}</TagLabel>
                                    </Tag>
                            ))}
                            </div>
                            {detailsTextForm === false ? <Button onClick={() => handleDetailTextChange(pagePtr)} colorScheme='green' variant="outline">Update Details</Button> : null}
                            {node["media"].length > 0 ? <div className="flex items-center justify-center">
                                <ImageGallery renderItem={renderImageWithDeleteButton} items={node["media"]} />;
                            </div> : null}
                            {openFileUploader ? <FileUploader handleChange={handleFileUpload} name="file" types={fileTypes} /> : null}
                            <Button onClick={() => setOpenFileUploader(!openFileUploader)} colorScheme='yellow'>Add Media</Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {"Trife © 2024"}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
      );
};

export default Node