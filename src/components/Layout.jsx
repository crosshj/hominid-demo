import './Layout.css';

/*
References:

https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Realizing_common_layouts_using_grids

*/

export const Layout = (args) => {
	const { slug, title, children } = args;
	const childItems = children[1].filter((x) => x.props.type !== 'Logo');
	const Logo = children[1].find((x) => x.props.type === 'Logo');
	const Menu = children[1].find((x) => x.props.type === 'Menu');

	console.log({ args });
	return (
		<div className="wrapper">
			<header className="main-head">{Logo}</header>
			<nav className="main-nav">{Menu}</nav>
			<article className="content">
				<h1>Main article area</h1>
				<p>
					Lorem ipsum dolor sit amet. Sit consequatur repellendus qui
					quaerat ratione qui molestias magni. 33 reiciendis dicta eos
					nihil doloribus est doloribus esse ad corporis saepe ad
					repudiandae architecto quo alias earum. Rem enim esse id
					quidem placeat in natus quae eos nemo deserunt et error
					dicta. Ut deleniti optio et alias illo cum perferendis
					laboriosam eos cupiditate similique qui aliquid expedita ex
					natus exercitationem. Aut corrupti esse aut expedita itaque
					id sint reprehenderit qui velit fugit.{' '}
				</p>
				<p>
					Est explicabo tempore et veritatis iusto cum iusto ipsam id
					vero repellendus est laudantium maxime in officiis iure et
					ipsam soluta! Et inventore veniam sit voluptas ducimus non
					consequatur deserunt ea laborum quas est repudiandae veniam
					rem soluta reiciendis est facilis neque. Ut aperiam labore
					ut unde quidem eum minus unde sit aliquid saepe? Qui dolorem
					nihil et rerum quas qui sint ipsum aut voluptates dolor et
					recusandae galisum in voluptas omnis vel ipsam aspernatur?
					Nam pariatur quas aut natus rerum vel quaerat perferendis.
					Non consequuntur autem aut fugit magni a inventore quasi et
					quisquam enim. Et eveniet sunt vel perferendis perspiciatis
					sed beatae repudiandae hic dicta molestiae aut illum magni
					eos dolorem molestias. Hic consequatur tempora eos optio
					molestiae At omnis corrupti! Qui architecto nobis non
					molestiae repudiandae qui porro fugit ea consequatur
					quisquam quo voluptate quis et aliquid nesciunt.{' '}
				</p>
				<p>
					Qui voluptate consectetur et distinctio voluptatibus non
					totam quia. Et odio rerum nam dolores tenetur qui similique
					voluptas qui ratione illum quo perferendis fuga ab ratione
					incidunt et praesentium enim! Sit ullam mollitia et quia
					accusamus et dolor beatae. Et sunt quam qui velit reiciendis
					hic perferendis Quis est Quis nobis est repellendus aliquam
					et laudantium doloremque. A eveniet fuga et similique
					dignissimos qui aperiam accusamus vel eligendi nihil non
					magni nesciunt et enim consequuntur? Qui sunt atque aut
					illum fugit aut rerum architecto aut pariatur tempore aut
					iusto voluptatem sit praesentium porro! Aut quidem
					voluptates et voluptas consequatur sit totam dolorem rem
					perferendis sint ut consequatur praesentium ut molestiae
					atque aut officiis iste. Est minus nesciunt ut doloremque
					maxime hic nemo illum est totam tempora. Ea explicabo
					commodi aut officia dolor qui aspernatur commodi aut sint
					labore aut neque harum ut consequatur necessitatibus.{' '}
				</p>
				<p>
					Nam mollitia dolores et recusandae quas qui quia impedit ad
					voluptate optio cum impedit repudiandae est impedit odio. Et
					expedita provident est aspernatur ipsam sed minus mollitia
					qui soluta voluptatem sed saepe repudiandae id atque illo
					quo harum corporis. Sit consequatur consequuntur et deserunt
					aliquid aut dolor amet ut vero similique sed quam autem. Eum
					nihil voluptatem et recusandae officiis aut galisum quidem!
					Sed dolorem suscipit non dolorem cupiditate 33 magni quidem
					non labore doloremque At vitae molestiae. Id iste nostrum
					vel quia quaerat qui perspiciatis aperiam qui ipsa
					voluptates. Qui quos blanditiis ea molestiae similique ad
					saepe quas a illo harum non provident natus quo alias
					possimus.{' '}
				</p>
				<p>
					Vel inventore voluptate eos consequatur corrupti ea delectus
					tenetur. Ut omnis dolor est accusamus repellat quo ducimus
					atque aut odio eius aut officia facere non mollitia aliquam.
					Et sunt quidem qui dolores possimus est aliquid esse et
					impedit galisum. Et consequatur commodi sit distinctio
					cupiditate non dolorem velit. Aut cumque laudantium ea
					ratione accusamus in odit excepturi in itaque nostrum a
					cumque laudantium.{' '}
				</p>
				<p>
					In officia neque sed necessitatibus reiciendis ut maxime
					dolores nam blanditiis fuga eum esse dolorum et ipsam
					assumenda? Aut odit autem aut iure praesentium hic tempora
					cupiditate eos incidunt necessitatibus ea aperiam quas. Ex
					quod consectetur et iste facilis et animi possimus in
					aliquam tempora sed perspiciatis explicabo et eligendi unde.
					Et ipsa doloremque non aliquid voluptates At molestiae iure
					eum amet cumque qui ipsa fugit. Nam doloribus deleniti ut
					modi nobis cum rerum quaerat rem perspiciatis nulla in
					voluptas quasi in autem enim qui culpa consequuntur. Ea
					numquam enim ut iusto quaerat in harum ratione. Ut neque
					odit id dolores fuga qui animi voluptatem 33 quidem quaerat
					33 voluptatem vitae hic quia sapiente rem eaque dolores. Ea
					magni necessitatibus non dolore omnis qui consequatur
					impedit. Et voluptatum modi est ipsum perspiciatis et
					dignissimos quasi eos internos saepe vel eligendi laudantium
					ut doloribus possimus.{' '}
				</p>
				<p>
					Rem labore rerum sed cupiditate quis ut quod cumque et
					possimus eligendi ut fugit nostrum et voluptate internos?
					Qui adipisci doloremque 33 rerum totam non aperiam
					consequatur eos atque odio. Et veniam molestias sed
					reprehenderit iste est blanditiis dolores et internos
					expedita. Qui rerum repellendus eum internos sint et alias
					laboriosam vel nemo minus et vero voluptatum ab amet fuga.
					Et minima quia est sint dolorem sed aperiam officiis et
					adipisci maiores ex nihil natus est consequatur enim. Ut
					maiores eligendi id nostrum fugiat aut atque consequatur aut
					iste ratione est dolor esse aut nesciunt nostrum et nihil
					natus. Sit repudiandae Quis ut voluptate ipsam qui
					architecto magnam ut voluptatibus magni sed sint distinctio
					qui nemo reiciendis!{' '}
				</p>
			</article>
			{/* <aside className="side">Sidebar</aside> */}
			<footer className="main-footer">The footer</footer>
		</div>
	);
};
