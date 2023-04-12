import { Photo } from "../types/photo";
import  {storage} from '../libs/firebase';
import {ref, listAll, getDownloadURL, uploadBytes, deleteObject} from 'firebase/storage';
import {v4 as createId} from 'uuid' // serve para criar hashs aleatórias


export const getAll = async () => {

    let list: Photo[] = [];

    const imagesFolder = ref(storage, "images"); // crio referencia da pagina
    const photoList = await listAll(imagesFolder); // leio os arquivos da pasta

    for(let i in photoList.items) { // faz um looping nos arquivos da pasta
        let photoUrl = await getDownloadURL(photoList.items[i]); // pega o link para acessar o arquivo da foto 

        list.push({ // monto meu array
            name: photoList.items[i].name,
            url: photoUrl
        });
    }

    return list; // retorno meu array

   
}

export const insert = async (file: File) => {
    
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {

        let randomName = createId();
        let newFile = ref(storage, `images/${randomName}`);

        let upload = await uploadBytes(newFile, file);
        let photoUrl = await getDownloadURL(upload.ref);

        return { name: upload.ref.name, url: photoUrl } as Photo;

    } else {
        
        return new Error('Tipo de arquivo não permitido.');
    }
}

export const deletePhoto = async (name: string) => {

    let photoRef = ref(storage, `images/${name}`);
    await deleteObject(photoRef);

}

