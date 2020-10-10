import React, {useEffect, useState} from "react";
import PropTypes from "prop-types"
import Tree from "rc-tree";

import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io"

import "./FoldersTree.scss"
import foldersFunctions from "../../utils/foldersFunctions";
import {ALL_FOLDER_ID, SPECIAL_FOLDERS_IDS} from "../../constants/folders";
import cardsFunctions from "../../utils/cardsFunctions";
import {foldersSelector, selectedFolderSelector} from "../../selectors/foldersSelectors";
import {connect} from "react-redux";
import {cardsSelectors} from "../../selectors/cardsSelectors";


function convertFoldersToTreeData(folders, depth = 1) {
    return (
        folders
            .filter((folder) => {
                // We return only folders where the folder depth is equal to the current function depth
                return (folder.path.split("/").length === depth)
            })
            .map((folder) => {
                // We return a folder tree node and if the current folder has subFolders we call the functions again (recurrence) to get the subFolders tree node ("children tree node property")

                // We get current folder subFolders
                const folderSubFolders = foldersFunctions.getFolderSubFolders(folder)

                // We increase the depth
                let newDepth = depth + 1
                // And we retrieve tree node children of the current folder subFolders
                const children = convertFoldersToTreeData(folderSubFolders, newDepth)

                return {
                    key: folder.id,
                    title: `${folder.name} - ${cardsFunctions.countCardsByFolderId(folder.id)}`,
                    children: children
                }
            })
    )
}


function FoldersTree({folders, cards, selectedFolder}) {
    const [treeData, setTreeData] = useState(convertFoldersToTreeData(folders))
    // We need to change the tree data also when cards are changed because we count how much cards there is in each folder
    useEffect(() => {
        setTreeData(convertFoldersToTreeData(folders))
    }, [folders, cards])


    // We can use selectedFolder.id to initialize the state because we set a default value for it
    const [treeSelectedKeys, setTreeSelectedKeys] = useState([selectedFolder.id])

    function handleTreeNodeSelect(selectedKeys) {
        //Check that there is one selectedKeys otherwise the selectedFolder will be undefined and it must not be undefined
        if (selectedKeys.length !== 0) {
            const selectedFolder = foldersFunctions.getFolder(selectedKeys[0])
            foldersFunctions.setSelectedFolder(selectedFolder)
        } else {
            const allFolder = foldersFunctions.getFolder(ALL_FOLDER_ID)
            foldersFunctions.setSelectedFolder(allFolder)
        }
    }

    // Each time selected folder change, also change the selected key, this is done like this because the selected folder can be changed elsewhere in the app
    useEffect(() => {
        setTreeSelectedKeys([selectedFolder.id])
    }, [selectedFolder])

    function handleTreeNodeDrop(info) {
        const dropNode = info.node;
        const dragNode = info.dragNode;

        const dropFolder = foldersFunctions.getFolder(dropNode.key)
        const dragFolder = foldersFunctions.getFolder(dragNode.key)

        const splitDropNodePos = dropNode.pos.split("-")
        const isDropToRoot = !dropNode.dragOver && splitDropNodePos.length === 2 && splitDropNodePos[0] === "0"

        if (SPECIAL_FOLDERS_IDS.includes(dragFolder.id)) {
            console.warn("You can't move this folder")
        } else if (SPECIAL_FOLDERS_IDS.includes(dropFolder.id) && !isDropToRoot) {
            console.warn("You can't move other folder to this folder")
        } else if (isDropToRoot) {
            foldersFunctions.moveFolder(dragFolder, null)
        } else {
            foldersFunctions.moveFolder(dragFolder, dropFolder)
        }
    }

    return <div>
        <Tree treeData={treeData}
              onSelect={handleTreeNodeSelect}
              prefixCls="FoldersTree"
              onDrop={handleTreeNodeDrop}
              draggable
              switcherIcon={(props) => {
                  if (props.isLeaf) return null
                  return props.expanded ? <IoIosArrowUp className="FoldersTree__ArrowUpIcon"/> :
                      <IoIosArrowDown className="FoldersTree__ArrowDownIcon"/>
              }}
              selectedKeys={treeSelectedKeys}
        />
    </div>
}

function mapStateToProps(state) {
    return {
        folders: foldersSelector(state),
        cards: cardsSelectors(state),
        selectedFolder: selectedFolderSelector(state)
    }
}

FoldersTree.propTypes = {
    folders: PropTypes.array.isRequired,
    cards: PropTypes.array.isRequired,
    selectedFolder: PropTypes.object.isRequired,
};


export default connect(mapStateToProps)(FoldersTree)
