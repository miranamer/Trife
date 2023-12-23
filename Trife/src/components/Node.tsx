import {React, useState, useRef} from 'react'
import { TreeNode } from "react-organizational-chart";
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
  } from '@chakra-ui/react'

//! Make a modal for the mood menu
//! Add project tags to nodes & context menu
//! Add editing to nodes
//! Make a new page with a default start tree when the next day arrives

//! FUTURE -> store trees in firebase or some storage
//! Add themes (e.g: Pastel, Dark Mode, Dracula, Galaxy, Studio Ghibli)
//! Add full tree view which shows all trees in column form (chronological order)

const Node = ({node, showTree, pages, setPages, pagePtr}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const [choice, setChoice] = useState<number>(0)
    const [nodeText, setNodeText] = useState<string>("");
    const [moods, setMoods] = useState<string[]>([]);

    const handleSelectChange = (e) => setChoice(parseInt(e.target.value));

    const choiceToStyleMap = ["StyledNodeNormal", "StyledNodeResultGood", "StyledNodeResultMedium", "StyledNodeResultBad"]
    const choiceToMoodMap = ["moodNormal", "moodGood", "moodMedium", "moodBad"]

    const addNode = () => {
        const nodeToAdd = {
            value: nodeText,
            children: [],
            nodeStyle: choiceToStyleMap[choice - 1],
            moodStyle: choiceToMoodMap[choice - 1]
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
        //^ Put emoji mood bar logic here -> open chakra ui modal to enter emoji
        setMoods([...moods, "🎃"]);
      }


    return (
        <>
            <TreeNode
            label={node.value !== "" ?
                <div
                className={`mt-[10px] ${node.nodeStyle} hover:cursor-pointer`}
                onClick={onOpen}
                >
                <div className="flex items-center justify-center w-full h-full">
                    {node.value}
                </div>
                    <div
                        onContextMenu={handleMoodMenu}
                        className={`somelement z-10 hover:cursor-pointer w-fit p-3 h-[5%] ${node.moodStyle} rounded-2xl border-2 flex items-center justify-center gap-3 text-lg`}
                    >
                        {moods.map((mood) => (
                        <p>{mood}</p>
                        ))}
                    </div>
                </div>
            : null}
            >
            {node.children.map((child) => showTree(child))}
            </TreeNode>

            <Modal isOpen={isOpen} onClose={onClose}>
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
                    {choice < 5 ? <><Input onChange={(e) => setNodeText(e.target.value)} placeholder='Node Text' />
                    <Button onClick={() => addNode()} colorScheme='green'>Create</Button></> : <div className="flex items-center justify-center"><Button className='w-full' onClick={() => deleteNode()} colorScheme='red'>Delete</Button></div>}
                </div>
            </ModalBody>

            <ModalFooter>
            </ModalFooter>
            </ModalContent>
            </Modal>
        </>
      );
};

export default Node