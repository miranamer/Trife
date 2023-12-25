import {React, useState, useRef} from 'react'
import { TreeNode } from "react-organizational-chart";
import { FaCheckCircle } from "react-icons/fa";
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
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogFooter,
    Tag,
    TagLabel,
    TagCloseButton
  } from '@chakra-ui/react'

//! Make a secret node type
//! Add editing to nodes
//! Make a new page with a default start tree when the next day arrives
//! Change Line Style
//! Left Click -> Details page w/ addition text, images and all tags like real journal
//! Right Click -> Manage Node Page (Add, Edit, Delete)
//! Option to delete or edit tags from global array

//! FUTURE -> store trees in firebase or some storage
//! Add themes (e.g: Pastel, Dark Mode, Dracula, Galaxy, Studio Ghibli)
//! Add full tree view which shows all trees in column form (chronological order)
//! TreeCounter = Show how many trees someone has made

const Node = ({node, showTree, pages, setPages, pagePtr, tags, setTags}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenMood, onOpen: onOpenMood, onClose: onCloseMood } = useDisclosure()
    
    const [choice, setChoice] = useState<number>(0)
    const [nodeText, setNodeText] = useState<string>("");
    const [tagMaker, setTagMaker] = useState<boolean>(false);
    const [tagColor, setTagColor] = useState<string>("");
    const [tagText, setTagText] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[][]>([]);
    const [mood, setMood] = useState<string>(node.mood);

    const handleSelectChange = (e) => setChoice(parseInt(e.target.value));

    const choiceToStyleMap = ["StyledNodeChoice", "StyledNodeResultGood", "StyledNodeResultMedium", "StyledNodeResultBad"]
    const choiceToMoodMap = ["moodChoice", "moodGood", "moodMedium", "moodBad"]

    const addNode = () => {
        const nodeToAdd = {
            value: nodeText,
            children: [],
            nodeStyle: choiceToStyleMap[choice - 1],
            moodStyle: choiceToMoodMap[choice - 1],
            mood: "",
            tags: selectedTags
        };

        console.log(nodeToAdd);

        node.children.push(nodeToAdd);
        setPages([...pages]);
    }

    const findParentNode = (currentNode, targetNode) => {
        if (currentNode.children.includes(targetNode)) {
          return currentNode;
        }
        for (const child of currentNode.children) {
          const parent = findParentNode(child, targetNode);
          if (parent) {
            return parent;
          }
        }
        return null;
    };

    const deleteNode = () => {
        console.log('Deleting...');
        const parentNode = findParentNode(pages[pagePtr].node, node);
        console.log('Parent: ', parentNode);

        if (parentNode) {
            parentNode.children = parentNode.children.filter((child) => child !== node);
            setPages([ ...pages ]);
        }
    }

    function handleMoodMenu(event) {
        //^ right click on emoji mood bar
        event.preventDefault(); // Prevent the default context menu from appearing
        setMood(node.mood);
        onOpenMood();
        //^ Put emoji mood bar logic here -> open chakra ui modal to enter emoji
        //node.moods = [...node.moods, "🎃"];
        //setPages([...pages])
    }

    const addNewTag = () => {
        setTags([...tags, [tagText, tagColor]])
    }

    const selectTag = (tag) => {
        if(selectedTags.includes(tag) == false){
            setSelectedTags([...selectedTags, tag])
        }
        else{
            setSelectedTags(selectedTags.filter(curr => curr != tag));
        }
    }

    const closeModal = () => {
        setNodeText("")
        setTagColor("")
        setTagText("")
        setTagMaker(false);
        setSelectedTags([]);
        onClose()
    }

    const handleMoodChange = () => {
        node.mood = mood
        
        if(mood === "🪄🪄🪄"){
            alert("You're a wizard Harry");
        }
        
        setPages([ ...pages ]);
    }


    return (
        <>
            <TreeNode
            label={node.value !== "" ?
                <div
                className={`mt-[10px] ${node.nodeStyle} hover:cursor-pointer`}
                onClick={onOpen}
                >
                <div className="flex flex-col items-center justify-center w-full h-full">
                    {node.tags.length > 0 ? 
                    <Tag
                    size='sm'
                    borderRadius='full'
                    variant='solid'
                    colorScheme={node.tags[0][1]}
                    className='absolute top-[-10px]'
                    >
                    <TagLabel>{node.tags.length > 1 ? `${node.tags[0][0]} + ${node.tags.length - 1}...` : node.tags[0][0]}</TagLabel>
                </Tag> : null}
                    {node.value}
                </div>
                    <div
                        onContextMenu={handleMoodMenu}
                        className={`somelement z-10 hover:cursor-pointer w-max p-3 h-[5%] ${node.moodStyle} rounded-2xl border-2 flex items-center justify-center gap-3 text-lg`}
                    >
                        <p>{node.mood}</p>
                    </div>
                </div>
            : null}
            >
            {node.children.map((child) => showTree(child))}
            </TreeNode>

            <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Manage Node</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <div className="flex flex-col gap-5">
                    <Select placeholder='Select Option' variant='filled' onChange={(e) => handleSelectChange(e)}>
                        <option value={1}>Add Choice</option>
                        <option value={2}>Add Good Result</option>
                        <option value={3}>Add Mid Result</option>
                        <option value={4}>Add Bad Result</option>
                        {node.isRoot !== true ? <option value={5}>Delete Node</option> : null}
                    </Select>
                    {choice < 5 ? <div className='flex flex-col gap-5'><Input onChange={(e) => setNodeText(e.target.value)} placeholder='Node Text' />
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
                    <Button onClick={() => setTagMaker(!tagMaker)}>Add New Tag</Button>
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
                    <Button onClick={() => addNode()} colorScheme='green'>Create</Button></div> : <div className="flex items-center justify-center"><Button className='w-full' onClick={() => deleteNode()} colorScheme='red'>Delete</Button></div>}
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


        </>
      );
};

export default Node