import re # regex









voc = []


prog = re.compile('^[a-z]+$')

with open('list.txt') as voc_in_f:
    for voc_in in voc_in_f:
        word = voc_in.strip()
        l = len(word)
        if l <= 7 and l > 1 and prog.match(word): 
            voc.append(word)

with open('out.txt', 'w') as out:
    for word in voc:
        out.write("%s\n" % word)