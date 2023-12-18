import { Category } from "@/app/models/category";

export const GetCategories = async (pageNumber:number,search:string,orderBy:string)=> {
    let url = `http://localhost:29468/api/categories?pageNumber=${pageNumber}&pageSize=5`;
    if(search)
    {
        url += `&Search=${search}`
    }
    if(orderBy)
    {
        url += `&OrderBy=${orderBy}`
    }
    return await fetch(url)
}
export const GetCategory = async (id:number)=> {
    let res = await fetch(`http://localhost:29468/api/categories/${id}`)
    if(res.ok)
    {
        return await res.json();
    }
    else
    {
        alert("Error occurred")
    }
}
export const PostCategory = async (name:string)  => {
    let options = {
        headers:{'Content-Type':'application/json'},
        method:'POST',
        body:JSON.stringify({name})
    }
    return await fetch('http://localhost:29468/api/categories',options)
}
export const UpdateCategory = async (category:Category)  => {
    let options = {
        headers:{'Content-Type':'application/json'},
        method:'PUT',
        body:JSON.stringify(category)
    }
    return await fetch(`http://localhost:29468/api/categories/${category.id}`,options)
}
export const DeleteCategory = async (id:number)  => {
    let options = {
        method:'DELETE',
    }
    return await fetch(`http://localhost:29468/api/categories/${id}`,options)
}