<h2 align="center">
 <img src="./assets/kube-log.jpg" alt="">
</h2>
<h1 align="center">
  ⚓ Kubernates ⚓
</h1>


![version](https://img.shields.io/badge/version-v1-blue)

# Indice

- [Sobre](#-sobre)
- [Acesso ao Pod](#-acesso-ao-pod)
- [Ambiente](#-ambiente)
- [Comandos](#-comandos)
---

## 🦺 Sobre

**Como os clusters no kubernates funcionam?**
Os clusters no kubernetes são comspostos por vários componentes, cada um desempenhando um papel importante no gerenciamento dos recursos no cluster.

Alguns dos principais componenetes de um cluesrt do kubernates incluem:

- **Master node**: o Master node é o componente cental do kubernates, resposavel pelo gerenciamento do cluster e pela tomada de decisões sobre onde e como executar os Pods.
- **Worker node**: o Worker node é um node que executa os Pods e outros recursos no amabiente do Kubernetes.
- **etcd**: etcd é um banco  de dados distribuido que armazena a configuração do Kubernates e o estado do cluster.
- **kubelet**: o kubelet é um agente que executa em cada node do cluester e gerencia os Pods que são executados nessa node.
- **kube-proxy**: o kube-proxy é responsavel por encaminhar o tráfego de rede para os Pods no cluster.
 <img src="./assets/kubernates-cluster.svg" alt="">

Este repositório contém as configurações necessárias para a criação de um ambiente personalizado de acordo com o produto desejado.

A estrutura de pastas é organizada da seguinte forma:
- **projeto** : Pasta principal do projeto
    - **aplicações** : Contém os arquivos de configuração das aplicações.
        - **deployment.yml** : Define as configurações do pod.
        - **configMap.yml** : Configura as variáveis de ambiente e volumes.
        - **service.yml** : Expõe o acesso ao pod.
        - **hpa.yml** : Configura autoscaling.

## 🛳️ Acesso ao Pod

Existem três tipos de serviços no Kubernetes que permitem que você exponha os aplicativos:

1. **ClusterIP**: Dá a um serviço um IP que é acessível dentro do cluster.
2. **NodePort**: Expõe o serviço em uma porta estática (o NodePort) em cada nó do cluster.
3. **LoadBalancer**: Expõe o serviço externamente usando o balanceador de carga de um provedor de nuvem.

  <img src="./assets/service-kubernates.svg" alt="">

## 🏗️ Ambiente
 
1 - O servidor deve ter o docker instalado: [docker](https://docs.docker.com/get-docker/)

2 - Instale o kubectl: 
- [kubectl-linux](https://kubernetes.io/docs/tasks/tools/)
- [kubectl-macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)
- [kubectl-windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

3 - Minikube & Kind

**kind** - Permite executar o Kubernetes em seu computador local. Esta ferramenta requer que você tenha Docker ou Podman instalado. 
 - [kind](https://kind.sigs.k8s.io/docs/user/quick-start/)

**Minikube** - é uma ferramenta que permite executar o Kubernetes localmente. minikubeexecuta um cluster Kubernetes local multifuncional ou de vários nós em seu computador pessoal (incluindo PCs Windows, macOS e Linux) para que você possa experimentar o Kubernetes ou para trabalho diário de desenvolvimento.
  - [minikube](https://minikube.sigs.k8s.io/docs/start/)

## 🛟 Comandos

```bash 
# Configurando secret no kubernates, neste exemplo atribuiu nome da secret como NEW-SECRET
$ kubectl create secret docker-registry new-secret --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>

```

OBS: Depois de criar a secret, você pode referenciá-la em seu arquivo de especificação do pod.

- imagePullSecrets:
  - name: new-secret

```bash 
# Criando configMap das envs
$ kubectl apply -f example-config-map.yml
# Criando service
$ kubectl apply -f example-service.yml
# Criando pod
$ kubectl apply -f= example-deployment.yml
# Criando hpa
$ kubectl apply -f example-hpa.yml
```

```bash 
# Deletando pod
$ kubectl delete -f example-deployment.yml
# Deletando configMap das envs
$ kubectl delete -f example-config-map.yml
# Deletando o service
$ kubectl delete -f example-service.yml
# Deleteando hpa
$ kubectl delete -f example-hpa.yml
```
```bash 
# Listando pods
$ kubectl get pods
# Listando services
$ kubectl get services
```


**Comandos Minikube**
```bash 
# vai iniciar o minikube
$ minikube start
# dashboard - o minikube possui um dashboard integrado.
$ minikube dashboard
# O comando minikube service é usado para acessar serviços que estão rodando no cluster Minikube. Ele cria uma rota entre o host (seu computador) e o serviço Kubernetes no cluster Minikube.
$ minikube service <service-name>
# Se você quiser apenas obter o URL do serviço sem abri-lo no navegador, pode usar a opção --url:
$ minikube service <service-name> --url
#ative as metricas para o HPA
$ minikube addons enable metrics-server

```
Consulte a documentação para mais detalhes:

- [Kubernetes (kubectl)](https://kubernetes.io/docs/reference/kubectl/overview/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/)

