pipeline {
    agent any

    environment {

        GITHUB_CREDENTIALS = credentials('ananthu&#039;s github key')
        AWS_CREDENTIALS = credentials('awscredentials')
        
    }
    
    stages {

        stage('SonarQube Analysis') {
            steps {
                script {
                   def scannerHome = tool 'SonarQube Scanner';
                   withSonarQubeEnv("SonarQube") {
                       sh """${tool("SonarQube Scanner")}/bin/sonar-scanner \
                       -Dsonar.projectKey=hcn-microservice \
                       -Dsonar.sources=./ \
                       -Dsonar.language=js \
                       -Dsonar.sourceEncoding=UTF-8 \
                       -Dsonar.projectName=HCN-microservice \
                       -Dsonar.projectVersion=1.0.0"""
                    }
                }
            }
        }
        stage('Unit Tests') {
            steps {
                nodejs('Node18') {
                    sh "npm i"
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {

                 dir('microservices/ms.hcn'){                                                //ms.hcn micro-service image build and push
                        script {
                   
                        docker.withRegistry('https://365956504116.dkr.ecr.ap-southeast-2.amazonaws.com', 'ecr:us-east-1:awscredentials') {

                        def app = docker.build("365956504116.dkr.ecr.ap-southeast-2.amazonaws.com/hcn-microservice:$params.TAG")
                
                        app.push()     // (4)

                    }
                    }
                    }
            }

        }

    }
}
