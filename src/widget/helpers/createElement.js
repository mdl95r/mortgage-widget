export default function createElement(tag, className, textContent = '') {
	const element = document.createElement(tag);
	element.className = className
	element.textContent = textContent

	return element
}