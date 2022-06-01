const quillLoadDoc = (socket,quill)=>{
    socket.once("load-document", document => {
        quill.setContents(document)
        quill.enable()
    })
} 

const quillUpdater = (socket,quill)=>{
    const handler = delta => {
        quill.updateContents(delta)
    }
    socket.on("receive-changes", handler);
}

const stopQuillListener = (socket) =>{
    socket.off("receive-changes")
}

export {quillLoadDoc,quillUpdater,stopQuillListener};