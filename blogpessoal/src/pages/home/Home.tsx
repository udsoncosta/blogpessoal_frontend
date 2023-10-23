import './Home.css'

function Home() {
    return (
        <>
            <div className='corpo'>
                <div>
                    <div className='paragrafo'>
                        <h2 className='titulo'>Seja Bem Vindo ao meu Blog Pessoal!</h2>
                        <br></br>
                        <p>Compartilhe aqui suas experiências e curiosidades!</p>
                    </div>
                    <br></br>

                    <div className='paragrafo'>
                        <img 
                            className='img'
                            src="https://img.freepik.com/vetores-gratis/ilustracao-do-conceito-de-teletrabalho_52683-36163.jpg?size=626&ext=jpg&ga=GA1.1.1037085861.1697763769&semt=ais"
                            alt="Icon de um escritório" 
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home