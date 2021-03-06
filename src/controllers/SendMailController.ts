import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';

class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, surveys_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email });

        if(!user) {
            return response.status(400).json({
                error: "User does not exist",
            });
        }

        const survey = await surveysRepository.findOne({ id: surveys_id} );

        if(!survey) {
            return response.status(400).json({
                error: "Survey does not exists!",
            });
        }

        const variables = {
            name: user.name, 
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL
        };

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: [{user_id: user.id}, {value: null}],
            relations: ["user", "survey"],
        })

        if(surveyUserAlreadyExists) {
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return response.json(surveyUserAlreadyExists);
        }


        //Salvar informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            surveys_id,
        });


        
        await surveysUsersRepository.save(surveyUser);
        
        

        //Envia email para o usuário

        await SendMailService.execute(email, survey.title, variables, npsPath);




        return response.json(surveyUser);

    }

}

export { SendMailController }