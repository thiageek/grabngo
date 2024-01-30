<h1 align="center">
  ⚓ Grabngo-Kubernates ⚓
</h1>


![ACT](../docs/grabngo-act.svg "ACT")

# Indice

- [Ambiente](#-ambiente)
- [Comandos](#-comandos)
---

## 🏗️ Ambiente

**Manifestos**

Este repositório contém as configurações necessárias para a criação de um ambiente.

A estrutura de pastas é organizada da seguinte forma:
- **k8s** : Pasta de manifestos do projeto
    - **grabngo-config-map.yml** : Configura as variáveis de ambiente.
    - **bd-deployment.yml** : Define as configurações do pod banco de dados postgress.
    - **grabngo-deployment.yml** : Define as configurações do pod do grabngo.
    - **bd-service.yml** : Expõe o acesso ao pod de banco de dados.
    - **grabngo-service.yml** : Expõe o acesso ao pod do grabngo.
    - **grabngo-hpa.yml** : Configura autoscaling para o grabngo.

**Configurando ambiente**

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

**Metrics**

```bash 
$ kubectl apply -f metrics.yml
```

**Banco de dados**

```bash 
# Criando pod
$ kubectl apply -f bd-deployment.yml
# Criando service de acesso
$ kubectl apply -f bd-service.yml
```
**Up Grabngo**

```bash 
#Subindo grabngo
# Criando configMap das envs
$ kubectl apply -f grabngo-config-map.yml
# Criando pod
$ kubectl apply -f grabngo-deployment.yml
# Criando service
$ kubectl apply -f grabngo-service.yml
# Criando hpa
$ kubectl apply -f grabngo-hpa.yml
```
**Down Grabngo**
```bash 
# Deletando pod
$ kubectl delete -f grabngo-deployment.yml
# Deletando configMap das envs
$ kubectl delete -f grabngo-config-map.yml
# Deletando o service
$ kubectl delete -f grabngo-service.yml
# Deleteando hpa
$ kubectl delete -f grabngo-hpa.yml
```
**Comandos auxiliares**
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
$ minikube service grabngo-service
# Se você quiser apenas obter o URL do serviço sem abri-lo no navegador, pode usar a opção --url:
$ minikube service grabngo-service --url
#ative as metricas para o HPA
$ minikube addons enable metrics-server

```
Consulte a documentação para mais detalhes:

- [Kubernetes (kubectl)](https://kubernetes.io/docs/reference/kubectl/overview/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/)

