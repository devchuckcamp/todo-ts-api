import supertest from 'supertest'
import { app } from '../index'


describe('todo', () =>{

    describe('get pending todo list', () => {

        describe('given there are results', ()=>{
            it('should return list todos | Todo[]', async() =>{
                const {body, statusCode} = await supertest(app).get(`/api/V1/todo/pending`)  
                expect(statusCode).toBe(200)
            })
        })

    })

})