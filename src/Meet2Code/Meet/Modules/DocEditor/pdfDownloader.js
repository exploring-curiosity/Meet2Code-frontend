
import { jsPDF } from 'jspdf';
const savePDF = () => {
    const editors = document.getElementsByClassName('ql-editor');
    if(editors.length === 0) {
        console.log('no element');
        return;
    }
    const input = editors[0].innerHTML;

    var doc = new jsPDF('p', 'pt', 'a4');
    var docName = prompt('Please enter Document name');
    doc.html(input, {
        callback: function (doc) {
            doc.save((docName?docName:"document") + ".pdf");
        },
        x: 10,
        y: 10
    });
}

export {savePDF};