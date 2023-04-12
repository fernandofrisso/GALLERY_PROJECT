import { useState, useEffect, FormEvent } from 'react';

import * as C from './app.style';

import * as Photos from './services/photo';
import { PhotoItem } from './components';

import { Photo } from './types/photo';


const App = () => {

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(()=>{

    getPhotos();

  }, []);

  const getPhotos = async () => {

    setLoading(true);

      setPhotos(await Photos.getAll());

    setLoading(false);

  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault(); // previne o comportamento padrão de enviar

    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if(file && file.size > 0) { //se o arquivo tem tamanho maior que zero, então...

      setUploading(true);
      let result = await Photos.insert(file);
      setUploading(false);

      if(result instanceof Error) { // se o resultado deu algum erro

        alert(`${result.name} - ${result.message}`);

      } else {

        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);

      }

    }

  }

  const handleDeleteClick = async (name: string) => {

    await Photos.deletePhoto(name);
    getPhotos();
    
  }

  return (

    <C.Container>

        <C.Area>

            <C.Header>Galeria de Fotos</C.Header>

              {/* area de upload */}

              <C.UploadForm method="POST" onSubmit={handleFormSubmit}>

                  <input type="file" name="image" />
                  <input type="submit" value="Enviar" />
                  {uploading && "Enviando..."}

              </C.UploadForm>

              {loading &&

                <C.ScreenWarning>

                  <div className="emoji">🤚</div>
                  <div>Carregando...</div>

                </C.ScreenWarning>
                
              }

              {/* area de fotos */}

              {!loading && photos.length > 0 && //qundo o loading for falso e tiver fotos

                  <C.PhotoList>

                      {photos.map((item, index)=>(

                        <PhotoItem

                          key={index}
                          url={item.url}
                          name={item.name}
                          onDelete={handleDeleteClick}
                         
                        />

                      ))}

                    </C.PhotoList>
                }

                      {!loading && photos.length === 0 &&

                          <C.ScreenWarning>

                            <div className="emoji">😞</div>
                            <div>Não há fotos cadastradas.</div>

                          </C.ScreenWarning>
        }


        </C.Area>

    </C.Container>

  )   
  
}

export default App;