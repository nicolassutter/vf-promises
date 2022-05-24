/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'

/**
 * 1. C'est quoi une Promise ?
 * 2. Un cas d'usage
 * 3. Comment attendre une Promise
 * 4. Gestion d'erreurs
 *
 * En bref, pourquoi try / catch c'est mieux ;)
 */

function useAPI() {
  return axios.get('https://jsonplaceholder.typicode.com/todos/1')
}

/**
 * Ici, nous n'attendons pas la réponse
 */
const first_example = () => {
  const result = useAPI()

  // @ts-ignore TS n'est pas content car nous n'attendons pas, d'ailleurs cela cause un crash. C'est bien TS non ?
  console.log(result.data)
}
// first_example()

/**
 * Méthode 1 pour attendre
 * `async / await`
 *
 * `async` permet de dire qu'il y aura du code "asynchrone", autrement dit, des choses à attendre, qui ne se passerons pas toutes en même temps.
 * `await` permet de spécifier quoi attendre, il ne peut être utilisé que dans une fonction déclarée `aysnc`
 *
 * -> À noter que les fonctions notées `async` retournent toujours une Promise.
 */
const second_example = async () => {
  const result = await useAPI()
  console.log(result.data)
}
// second_example()

/**
 * Méthode 2 pour attendre
 * `.then`
 *
 * `.then` est une fonction disponible sur chaque Promise et permet de lui passer une autre fonction qui sera lancée à la résolution.
 * Compliqué ? Exemple.
 */
const third_example = () => {
  useAPI()
    .then(() => {
      console.log('Message affiché uniquement quand la Promise est terminée (résolue)')
    })
}
// third_example()

/**
 * --------
 * Choses à éviter
 * --------
 */

const fourth_example = async () => {
  /**
   * `await` inutile si on utilise déjà .then, c'est l'un ou l'autre. Pas les deux.
   * La fonction n'a d'ailleurs pas besoin d'être async
   */
  await useAPI()
    .then(() => {
      console.log('Message affiché uniquement quand la Promise est terminée (résolue)')
    })
}
// fourth_example()

const fifth_example = () => {
  /**
   * Le .then ne fait attendre que ce qui se trouve à l'intérieur, pas le reste.
   */
  let test = 'test'

  useAPI()
    .then(() => {
      test = 'autre test'
      console.log('Message affiché uniquement quand la Promise est terminée (résolue)')
    })

  console.log(test) // 'test'
}
// fifth_example()

const sixth_example = async () => {
  /**
   * Le await fait tout attendre, ce qui le rend plus simple à utiliser et permet d'eviter des erreurs bêtes comme plus haut.
   */
  let test = 'test'

  await useAPI()

  test = 'autre test'
  console.log('Message affiché uniquement quand la Promise est terminée (résolue)')

  console.log(test) // 'autre test'
}
// sixth_example()

/**
 * --------
 * Plusieurs Promise, la perf
 * --------
 */
const seventh_example = async () => {
  /**
   * Ici chaque await fait tout attendre, si l'API met 200ms à répondre, on attendra un total de 200ms * 3 avant de voir le console.log.
   */
  await useAPI()
  await useAPI()
  await useAPI()
  console.log('hello')
}
// seventh_example()

const eighth_example = async () => {
  /**
   * Promise.all permet de "fusionner" plusieurs Promise en une seule, on peut ensuite l'attendre normalement.
   * L'avantage c'est que ces trois Promise seront lancées en même temps.
   *
   * Dans un monde parfait si l'API répond TOUJOURS en 200ms, nous n'attendrons que 200ms (au lieu de 600ms) avant le console.log
   *
   * Il est donc préférable d'utiliser cette méthode quand c'est possible.
   */
  await Promise.all([
    useAPI(),
    useAPI(),
    useAPI()
  ])
  console.log('hello')
}
// eighth_example()


/**
 * --------
 * .catch et .finally
 * --------
 */
const ninth_example = (): string => { // retournera toujours 'truc' car .then ne fait pas attendre
  useAPI()
    .then((res) => {
      // console.log(res.status)
      return res // Ici le return ne fait rien
    })
    .catch((error) => { /* */ })
    .finally(() => { /* */ })

  return 'truc'
}
// console.log(ninth_example())

/**
 * --------
 * catch et finally
 * --------
 */
const thenth_example = async () => { // ne retournera pas toujours 'truc'
  try {
    const res = await useAPI()
    // console.log(res.status)
    return res // Le return fonctionne comme attendu
  } catch (error) {
    /* */
  } finally {
    /* */
  }

  return 'truc'
}
// console.log(thenth_example())


/**
 * --------
 * Les boucles
 * --------
 */

const final_example = async () => {
  const arr = [1, 2]
  let message = 'Message par défaut'

  arr.forEach(async (i) => {
    const res = await useAPI()
    message = res.statusText + i
  })

  /**
   * string vide car `forEach ne peut pas être attendu et lance toutes les itérations en même temps.
   * Btw mettre un `await` devant le `forEach` ne sert à rien.
   */
  console.log(message)

  /* ----------------- */

  const arr2 = [1, 2]
  let message2 = ''

  for await (const i of arr2) {
    const res = await useAPI()
    message2 = res.statusText + i
  }

  console.log(message2) // 'OK2', car `for await` fonctionne comme on le souhaite et attend entre chque iteration.
}
// final_example()