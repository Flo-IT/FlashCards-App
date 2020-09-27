import React from "react";
import Tree from "rc-tree";

import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io"

import "./FoldersTreeView.scss"
import foldersManager from "../../utils/foldersManager";
import {ALL_FOLDER_ID} from "../../constants/folders";

function convertFoldersToTreeData(folders, depth = 1) {
    return (
        folders
            .filter((folder) => {
                return (folder.path.split("/").length === depth)
            })
            .map((folder) => {
                const folderSubFolders = getFolderSubFolders(folder, folders)
                let newDepth = depth + 1

                if (folderSubFolders.length === 0) {
                    return {key: folder.id, title: folder.name}
                } else {
                    const children = convertFoldersToTreeData(folderSubFolders, newDepth)

                    // Check if there is children (if it's not the case, it's because two folder have the same beginning name)
                    return {
                        key: folder.id,
                        title: children.length !== 0 ? `${folder.name} - ${folderSubFolders.length}` : folder.name,
                        children: children
                    }


                }

            })
    )
}

function getFolderSubFolders(folder, otherFolders) {
    return otherFolders.filter((otherFolder) => {
        return otherFolder.path.startsWith(folder.path) && otherFolder.path !== folder.path
    })
}

function changeFolderAndSubFoldersPathFromFolders(movedFolder, destinationFolder, folders) {
    const isDragToAllFolder = destinationFolder.id === ALL_FOLDER_ID
    return folders.map((folder) => {
        if (folder.path.startsWith(movedFolder.path)) {
            const splitFolderPath = folder.path.split("/")
            const splitMovedFolderPath = movedFolder.path.split("/")
            const pathPartNumberToKeep = (splitFolderPath.length - splitMovedFolderPath.length + 1)
            const folderLastPathPart = splitFolderPath.slice(splitFolderPath.length - pathPartNumberToKeep).join("/")


            if (isDragToAllFolder) {
                return {...folder, path: folderLastPathPart}
            }

            return {...folder, path: `${destinationFolder.path}/${folderLastPathPart}`}
        }
        return folder
    })
}

function FoldersTreeView({folders, setSelectedFolder}) {
    const treeData = convertFoldersToTreeData(folders)

    function onSelect(selectedKeys) {
        //Check that there is one selectedKeys otherwise the selectedFolder is undefined and it cannot be undefined
        if (selectedKeys.length !== 0) {
            setSelectedFolder(folders.find((folder) => {
                return folder.id === selectedKeys[0]
            }))
        } else {
            setSelectedFolder(null)
        }
    }


    function onDrop(info) {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;

        const dropFolder = foldersManager.getFolderFromFolderList(dropKey)
        const dragFolder = foldersManager.getFolderFromFolderList(dragKey)

        foldersManager.setFolders(changeFolderAndSubFoldersPathFromFolders(dragFolder, dropFolder, folders))
    }

    return <div>
        <Tree treeData={treeData}
              onSelect={onSelect}
              prefixCls="folders-tree-view"
              onDrop={onDrop}
              draggable
              switcherIcon={(props) => {
                  if (props.isLeaf) return null
                  return props.expanded ? <IoIosArrowUp className="folders-tree-view__ios-arrow-up-icon"/> :
                      <IoIosArrowDown className="folders-tree-view__ios-arrow-down-icon"/>
              }}

        />
    </div>
}

export default React.memo(FoldersTreeView)