

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "ListyString.h"

#define MAXCHARS 1024

node *createNode(char key);

node *recursiveTailInsert(node *head, char key);

void recursivePrintList(node *head);

node *deleteChar(node *head, char key);

node *deleteAtHead(node *head);

node *deleteAndShift(node *iter, node *head);

node *replaceAtHead(node *head, char *str);

node *replaceCharInside(node *iter, char *str);

node *destroyList(node *head);

int main(int argc, char **argv){
//int main(void){

    char word[MAXCHARS], str[MAXCHARS];
    char leadingChar, key;

    node *head = NULL;

    FILE *ifp;

    if((ifp = fopen(argv[1], "r")) == NULL){
        printf("Could not open file.\n");
    }

    fscanf(ifp, "%s", word); // the word the program will be manipulating

    head = stringToList(word); // separate the word into a linked list

    while (fscanf(ifp, " %c", &leadingChar) != EOF) { // keep scanning in the leading character until the end of the file has been reached

        switch (leadingChar){ // the leading char will determine what procedures are made

            case '@':
                fscanf(ifp, " %c", &key);
                fscanf(ifp, "%s", str);
                head = replaceChar(head, key, str);
                break;
            case '-':
                fscanf(ifp, " %c", &key);
                head = deleteChar(head, key);
                break;
            case '~':
                head = reverseList(head);
                break;
            case '!':
                printList(head);
                break;
            default:
                printf("Sorry, that is not a valid operation.\n");
        }
    }

    head = destroyList(head); // destroy the list at the end

    return 0;
}


// separates a string into a linked list
node *stringToList(char *str){

    int i = 0;
    node *head = NULL;

    if (str == NULL || str[0] == '\0') // makes sure the string isnt empty
        return NULL;

    while (str[i] != '\0'){
        head = recursiveTailInsert(head, str[i]); // insert each character into the newly created list
        i++;
    }

    return head;
}



// replaces a character in a linked list with a string
node *replaceChar(node *head, char key, char *str){

    node *iter;

    // make sure we are not dealing with an empty list
    if (head == NULL){
        return NULL;
    }

    if (str == NULL || str[0] == '\0') // makes sure the string isnt empty
        return deleteChar(head, key); // if it is, simply delete every instance of the key

    iter = head;

    while(iter != NULL){ // keep moving through the linked list until the end is found

        if ((iter->data) == key){ // we found the key in this position of the linked list

            if (iter == head){ // if we want to replace a char at the head
                iter = iter->next;
                head = replaceAtHead(head, str);
            }
            else // if we want to replace a char inside the list
                iter = replaceCharInside(iter, str);

        }
        else
            iter = iter->next;
    }

    return head;

}


// replaces a character at the head of a linked list with a string
node *replaceAtHead(node *head, char *str){

    node *temp = head->next;
    node *strHead = stringToList(str);
    node *iter;

    for (iter = strHead; iter->next != NULL; iter = iter->next) // go to the end of strHead
		;

    //iter is now pointing at the last node in the list
    free(head);
    iter->next = temp; // put the rest of our head array at the end of strHead so we have a list with it first
    return strHead;
}



// replaces a char with a string in a linked list. Used for any other place in a linked list besides the head
node *replaceCharInside(node *iter, char *str){
    node *temp = iter->next;
    node *strHead = stringToList(str);
    node *temp2;

    if (iter->next == NULL){ // we know that we are replacing the tail of the list
        iter->data = strHead->data;
        iter->next = strHead->next;
        return NULL;
    }

    for (temp2 = strHead; temp2->next != NULL; temp2 = temp2->next)
		;

    //temp2 is now pointing at the last node in the srtHead list
    temp2->next = temp;
    iter->data = strHead->data;
    iter->next = strHead->next;

    return temp;
}



node *reverseList(node *head){

    node *prev = NULL;
    node* pos = head; // current postion in the list
    node* next;

    while (pos != NULL) // continue until we have hit the end of the list
    {
        next = pos->next; // hold the next node after our current position
        pos->next = prev; // point to our previous position instead of our next position
        prev = pos; //more prev forward
        pos = next;
    }

    head = prev;

    return head;
}


// Recursively print the linked list.
void recursivePrintList(node *head)
{
	if (head == NULL)
		return;

	// To make this print the list in reverse, simply swap the order of these
	// two lines of code.
	printf("%c", head->data);
	recursivePrintList(head->next);
}


void printList(node *head){

    if (head == NULL)
	{
		printf("(empty list)\n"); // make sure we are not working with an empty list
		return;
	}

	recursivePrintList(head);
	printf("\n");

    return;

}


// deletes a charcter out of a linked list
node *deleteChar(node *head, char key){

    node *iter = NULL;

    // make sure we are not dealing with an empty list
    if (head == NULL){
        return NULL;
    }

    iter = head;

    while(iter != NULL){ // keep moving through the linked list until the end is found

        if ((iter->data) == key){ // we found the key at this position

            if (iter == head){ // the key was found at the head
                head = deleteAtHead(head);
                iter = head;
            }
            else{
                iter = deleteAndShift(iter, head); // the key was found inside the linked list
            }

        }

        else
            iter = iter->next;
    }

    return head;
}


// deletes the head of a linked list and shifts the rest of the list
node *deleteAtHead(node *head){

    node *temp;

    if (head == NULL){
        return NULL;
    }

    temp = head->next;
    free(head);

    return temp; // the head will now be temp: a linked list without the first original head node
}



node *deleteAndShift(node *iter, node *head){

    node *temp, *temp2;

    if (iter->next == NULL){ // we are deleting the tail of the linked list
        temp = head;
        while(temp->next != NULL) // gotta find the previous node... sorry you probably don't love this but it works!
          {
                temp2=temp;
                temp=temp->next;
          }
          free(temp2->next); // temp 2 is our previous node... we are now deleting the correct node
          temp2->next=NULL; // now the old previous node is the last of the list
          return NULL;
    }

    // if the position we are working with is not the head or the tail of the linked list
    iter->data = iter->next->data;
    temp = iter->next->next;
    free(iter->next);
    iter->next = temp;

    return iter;
}


// Creates a new node. Properly initializes all fields.
node *createNode(char key)
{
	node *ptr = malloc(sizeof(node));

	ptr->data = key;
	ptr->next = NULL;

	return ptr;
}



node *recursiveTailInsert(node *head, char key){

    if (head == NULL)
		return createNode(key);

    head->next = recursiveTailInsert(head->next, key);
	return head;
}



// Recursively free all memory associated with this linked list.
node *destroyList(node *head)
{
	if (head == NULL)
		return NULL;

	// We destroy the *rest* of the linked list, then come back to this node
	// and destroy it. So, we destroy the tail of the list first, then work
	// our way back toward the head.
	destroyList(head->next);
	free(head);

	return NULL;
}
