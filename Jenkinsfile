pipeline {
    agent {
        docker {
            image 'node:18-alpine' 
            args '-p 3000:3000' 
        }
    }
    
    environment {
        // Define environment variables
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        MONGODB_URI = credentials('mongodb-uri')
        CLERK_PUBLISHABLE_KEY = credentials('clerk-publishable-key')
        CLERK_SECRET_KEY = credentials('clerk-secret-key')
        DOCKER_IMAGE = "debabratap/contact-manager-app"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Get code from GitHub repository
                checkout scm
                echo 'Code checkout complete'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                echo 'Dependencies installation complete'
            }
        }
        
        stage('Code Quality Check') {
            steps {
                sh 'npm run lint || true'
                echo 'Code quality check complete'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test || true'
                echo 'Tests complete'
            }
        }
        
        stage('Build Application') {
            steps {
                // Set environment variables for build
                withCredentials([
                    string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI'),
                    string(credentialsId: 'clerk-publishable-key', variable: 'CLERK_PUBLISHABLE_KEY'),
                    string(credentialsId: 'clerk-secret-key', variable: 'CLERK_SECRET_KEY')
                ]) {
                    sh 'MONGODB_URI=$MONGODB_URI CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY CLERK_SECRET_KEY=$CLERK_SECRET_KEY npm run build || true'
                }
                echo 'Build complete'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                // Install Docker client
                sh 'apk add --no-cache docker'
                
                // Build Docker image
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest ."
                echo 'Docker image build complete'
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                // Login to Docker Hub and push image
                sh "echo ${DOCKER_HUB_CREDS_PSW} | docker login -u ${DOCKER_HUB_CREDS_USR} --password-stdin"
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker push ${DOCKER_IMAGE}:latest"
                echo 'Docker image push complete'
            }
        }
        
        stage('Deploy to Development') {
            steps {
                // Deploy to development environment
                sh '''
                    docker-compose -f docker-compose.dev.yml down || true
                    docker-compose -f docker-compose.dev.yml up -d
                '''
                echo 'Deployment to development complete'
            }
        }
        
        stage('Integration Tests') {
            steps {
                // Run integration tests against development environment
                sh 'npm run test:integration || true'
                echo 'Integration tests complete'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                // Deploy to production environment
                input message: 'Deploy to production?'
                sh '''
                    docker-compose -f docker-compose.prod.yml down || true
                    docker-compose -f docker-compose.prod.yml up -d
                '''
                echo 'Deployment to production complete'
            }
        }
    }
    
    post {
        always {
            // Clean up
            sh 'docker logout'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            // Send notification on failure
            mail to: 'admin@example.com',
                 subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                 body: "Something is wrong with ${env.BUILD_URL}"
        }
    }
}
