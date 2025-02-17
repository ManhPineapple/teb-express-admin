#!/usr/bin/env groovy

node {
    // Clean workspace before doing anything
    deleteDir()

    try {
        try {
            // get deploy setting
            deploySettings = getDeploySettings()
        } catch(err) {
            println(err.getMessage());
            throw err
        }

        echo "Building..."

        // Prepare stage: clone projects
        stage ('Prepare') {
            // clone lionnix repo
            dir('shipping-admin') {
                git(
                    credentialsId: 'GitAccessId',
                    branch: "${env.BRANCH_NAME}",
                    url: 'git@gitlab.com:lionnix/shipping-admin.git'
                )
            }
        }

        // Build stage: build image then push to private registry. Only build on branch master
        image = "${deploySettings.image_name}:${deploySettings.image_tag}"
        stage ('Build') {
            if (deploySettings.branch == 'master' || deploySettings.branch == 'dev' || deploySettings.branch == 'dev-eks') {
                dir('shipping-admin') {
                    withDockerRegistry([
                        credentialsId: 'docker-registry-credentials',
                        url: "${deploySettings.private_registry_address}"]) {
                        sh "docker build -t ${image} -f ${deploySettings.dockerfile_name} --build-arg MODE=${deploySettings.mode} ."
                        sh "docker push ${image}"
                    }
                }
            } else {
                echo "Build only available for dev and staging branch. Skip."
                currentBuild.result = 'FAILED'
            }
        }

        // Deploy stage: deploy docker image to k8s
        stage ('Deploy') {
            deployTag = "${deploySettings.image_tag}"
            if (deploySettings.branch == 'master') {
                appEnv = "staging"
            }

            if (!deployTag) {
                currentBuild.result = 'FAILED'
                echo "Unable to get deploy tag or this branch is not allowed to deploy. Stop."
            }

            dir('shipping-admin') {
                // use same namespace on staging/dev
                sh """
                    KUBECONFIG=${deploySettings.kube_config} helm upgrade --install -f ${deploySettings.helm_values_file} ${deploySettings.helm_release} --set image.tag=${deployTag} deploy/helm_chart

                    KUBECONFIG=${deploySettings.kube_config} kubectl rollout status deployment ${deploySettings.service_name} -n ${deploySettings.namespace}
                """
            }
        }

        stage('Remove image') {
            sh "docker rmi ${image}"
        }

        stage ('Clean') {
            deleteDir()
        }

    } catch (err) {
        currentBuild.result = 'FAILED'
        throw err
    }
}

def getDeploySettings() {
    def deploySettings = [:]


    dockerImageName = "nexus.lionnix.net/web-ui/shipment-admin"
    serviceName = "shipment-admin"
    namespace = "shipment-web-ui"

    // end fill args
    privateRegistryAddress = "https://nexus.lionnix.net" // private registry address
    branchName = env.BRANCH_NAME // current branch name of project
    buildNumber = env.BUILD_NUMBER // current build number
    dockerfileName = "deploy/docker/Dockerfile"

    if (branchName == 'master') {
        // deploy code on master branch to master
        helmValueFile = "default.values.prod.yaml"
        kubeConfig = "/var/lib/jenkins/.kube/lionnix-prod"
        dockerImageTag = "release-${buildNumber}"
        mode = "production"
        deploySettings['helm_release'] = serviceName

    } else if (branchName == 'dev') {
        // deploy code on master branch to master
        helmValueFile = "default.values.dev.yaml"
        kubeConfig = "/var/lib/jenkins/.kube/lionnix-dev"
        dockerImageTag = "dev-${buildNumber}"
        mode = "development"
        deploySettings['helm_release'] = serviceName

    } else if (branchName == 'dev-eks') {
        // deploy code on master branch to master
        helmValueFile = "default.values.dev-eks.yaml"
        kubeConfig = "/var/lib/jenkins/.kube/lionnix-prod"
        dockerImageTag = "dev-${buildNumber}"
        mode = "development"
        namespace = "dev-${namespace}"
        deploySettings['helm_release'] = "${serviceName}-dev"
    } 

    // docker image info to build
    deploySettings['private_registry_address'] = privateRegistryAddress
    deploySettings['branch'] = branchName
    deploySettings['dockerfile_name'] = dockerfileName
    deploySettings['image_tag'] = dockerImageTag
    deploySettings['image_name'] = dockerImageName
    deploySettings['mode'] = mode

    // k8s/helm info for deployment
    deploySettings['helm_values_file'] = "${helmValueFile}"
    deploySettings['kube_config'] = kubeConfig
    deploySettings['namespace'] = namespace

    // app name
    deploySettings['service_name'] = serviceName

    // switch to new aws cluster
    deploySettings['helm_cmd'] = "helmet"
    deploySettings['helmet_path'] = "/var/lib/jenkins/.helmet"

    return deploySettings
}