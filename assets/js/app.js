 let cl =console.log;


 const postform =document.getElementById('postform')
 const title =document.getElementById('title')
 const content =document.getElementById('content')
 const createpost =document.getElementById('createpost')
 const  postContainer =document.getElementById("postContainer")
 const  upDatebtn =document.getElementById("upDatebtn")
  
 
 

  let BaseUrl =`http://localhost:3000/posts`

  let singlePOST =`http://localhost:3000`
 

  const templating =(arr)=>{
    let result ='';
    arr.forEach(ele => {
        result += `
            <div class="card mb-4" id="${ele.id}">
            <div class="card-header">
                <h3>${ele.title}</h3>
            </div>
            <div class="card-body">
                <p>${ele.content}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-info" onclick="onEditBtn(this)">Edit</button>
                <button class="btn btn-danger"  onclick="onDeletBtn(this)">Delete</button>

            </div>
            </div>

        `
    });
    postContainer.innerHTML=result;
}

  const MakeApiCall =(method, ApiUrl, body)=>{
        return new Promise((resolve, reject)=>{
            let xhr = new XMLHttpRequest()

            xhr.open(method, ApiUrl)
            xhr.setRequestHeader("content-type", "application/json")
            xhr.setRequestHeader("auth", "bearer token get from localstorage")
            xhr.onload = ()=>{
                 return xhr.status >= 200 || xhr.status <= 300 ? resolve(xhr.response) : reject('Api is failed')  
            }

            xhr.send(body)
        })
  }

  MakeApiCall( "GET", BaseUrl)
    .then(res =>{ 
        templating(JSON.parse(res))
    })
    .catch(err =>{
        cl(err)
    })

const onPostform=(eve)=>{
   eve.preventDefault()
    let obj ={
        title : title.value,
        content :content.value
    }
    MakeApiCall("POST", BaseUrl, JSON.stringify(obj))
    .then(res =>{
        cl(res)
    })
    .catch(err)
}

const onEditBtn =(ele)=>{
    let editId = ele.closest('.card').id;
    localStorage.setItem("editId", editId)
    let editUrl = `${BaseUrl}/${editId}`

    MakeApiCall("GET", editUrl)
    .then(res =>{
        let data = JSON.parse(res)
        title.value = data.title,
        content.value = data.content
       
    })
    .catch(err =>{
        cl(err)
    })
    upDatebtn.classList.remove('d-none')
    createpost.classList.add("d-none")
    
}

const onUpdate =(ele)=>{
 let updateId = localStorage.getItem('editId')
 
 let updatUrl = `${BaseUrl}/${updateId}`
 cl(updatUrl)

 let o ={
    title : title.value,
    content: content.value
 }
 MakeApiCall( "PATCH", updatUrl , JSON.stringify(o))
 .then(res =>{
    cl(res)
 })
 .catch(err =>{
    cl(err)
 })

}

const onDeletBtn =(ele)=>{
    let deletId = ele.closest('.card').id;
  let deletUrl = `${BaseUrl}/${deletId}`
MakeApiCall('DELETE', deletUrl)
    .then(res =>{
        cl(res)
    })
    .catch(cl)
}
    postform.addEventListener("submit", onPostform)
    upDatebtn.addEventListener('click', onUpdate)