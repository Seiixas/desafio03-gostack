import React, { useState, useEffect } from "react";

import api from './services/api';

import "./styles.css";

function App() {

  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    })
  }, [])

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `Projeto ${Date.now()}`,
      url: 'www.url.com',
      techs: ['React', 'NodeJs']
    });

    setRepositories([...repositories, response.data]);
  }

  async function handleAddLike(id) {
    const response = await api.post(`/repositories/${id}/like`);
    const repositoryLiked = repositories.findIndex(repository => repository.id === id);

    let repositoriesCopy = [...repositories];
    repositoriesCopy[repositoryLiked] = response.data;

    setRepositories(repositoriesCopy);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);
    setRepositories(repositories.filter(repository => 
      repository.id !== id
    ));
  }

  return (
    <div>
      <ul data-testid="repository-list">
        { repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}

            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>

            <button onClick={() => handleAddLike(repository.id)}>
              Curtir ({repository.likes})
            </button>
          </li>
        )) }
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
